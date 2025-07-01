import asyncHandler from 'express-async-handler';
import Scholar from '../models/schemas/scholar.js';
import { validationResult } from 'express-validator';
import CustomError from '../utils/customError.js';
import { deleteFile, generateFileUrl } from '../utils/fileUtils.js';

// ============= SUBMIT SCHOLAR REQUEST =============
export const submitScholarRequest = asyncHandler(async (req, res, next) => {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError('Erreurs de validation', 400));
    }

    const { name, epoque, domaineExpertise, biography } = req.body;

    // Vérifier si un savant avec le même nom existe déjà
    const existingScholar = await Scholar.findOne({ 
        name: { $regex: `^${name}$`, $options: 'i' }
    });
    
    if (existingScholar) {
        return next(new CustomError('Un savant avec ce nom existe déjà', 400));
    }

    // Handle picture upload
    let pictureUrl = null;
    if (req.file) {
        // Generate the file URL using the uploaded file's filename
        pictureUrl = req.file.filename;
    }

    // Créer la demande de savant
    const scholar = new Scholar({
        name,
        picture: pictureUrl,
        epoque,
        domaineExpertise,
        biography,
        submittedBy: req.user._id,
        status: 'pending'
    });

    try {
        const savedScholar = await scholar.save();
        await savedScholar.populate('submittedBy', 'firstName familyName userName email');

        res.status(201).json({
            success: true,
            message: 'Demande de savant soumise avec succès',
            data: savedScholar
        });
    } catch (error) {
        // If scholar creation fails, delete the uploaded file
        if (req.file) {
            deleteFile(req.file.filename);
        }
        throw error;
    }
});
// ============= GET ALL APPROVED SCHOLARS =============
export const getApprovedScholars = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'asc',
    } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
    };

    const scholars = await Scholar.advancedSearch(options);
    const total = await Scholar.countDocuments({ 
        status: 'approved',
    });
    
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        success: true,
        data: scholars,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
        }
    });
});

// ============= SEARCH SCHOLARS =============
export const searchScholars = asyncHandler(async (req, res) => {
    const { q, type = 'name', page = 1, limit = 10 } = req.query;

    if (!q) {
        return res.status(400).json({
            success: false,
            message: 'Terme de recherche requis'
        });
    }

    const options = { page: parseInt(page), limit: parseInt(limit) };
    let scholars;

    switch (type) {
        case 'name':
            scholars = await Scholar.searchByName(q, options);
            break;
        case 'epoque':
            scholars = await Scholar.searchByEpoque(q, options);
            break;
        case 'domaine':
            scholars = await Scholar.searchByDomaine(q, options);
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Type de recherche invalide'
            });
    }

    res.status(200).json({
        success: true,
        data: scholars,
        searchTerm: q,
        searchType: type
    });
});

// ============= ADVANCED SEARCH SCHOLARS =============
export const advancedSearchScholars = asyncHandler(async (req, res) => {
    const { 
        name, 
        epoque, 
        domaineExpertise, 
        page = 1, 
        limit = 10, 
        sortBy = 'name', 
        sortOrder = 'asc' 
    } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (epoque) filters.epoque = epoque;
    if (domaineExpertise) filters.domaineExpertise = domaineExpertise;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
    };

    const scholars = await Scholar.advancedSearch(filters, options);
    
    // total matching documents for pagination
    const query = { status: 'approved' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (epoque) query.epoque = epoque;
    if (domaineExpertise) query.domaineExpertise = domaineExpertise;
    
    const total = await Scholar.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        success: true,
        data: scholars,
        filters,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
        }
    });
});

// ============= GET SINGLE SCHOLAR =============
export const getScholar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { includeArticles = false, articlesPage = 1, articlesLimit = 5 } = req.query;

    const scholar = await Scholar.findById(id)
        .populate('submittedBy', 'firstName familyName userName email');

    if (!scholar) {
        return next(new CustomError('Savant non trouvé', 404));
    }

    // Seuls les savants approuvés sont visibles publiquement
    // L'utilisateur qui a soumis et les admins peuvent voir tous les savants
    const canView = scholar.status === 'approved' ||
        scholar.submittedBy._id.toString() === req.user?._id?.toString() ||
        req.user?.role === 'admin';

    if (!canView) {
        return next(new CustomError('Savant non accessible', 403));
    }

    let response = { scholar };

    // Inclure les articles si demandé
    if (includeArticles === 'true' && scholar.status === 'approved') {
        const articles = await scholar.getArticles({
            page: parseInt(articlesPage),
            limit: parseInt(articlesLimit)
        });
        response.articles = articles;
    }

    res.status(200).json({
        success: true,
        data: response
    });
});


// ============= GET USER'S SCHOLAR REQUESTS =============
export const getUserScholarRequests = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scholars = await Scholar.find({ submittedBy: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('adminReview.reviewedBy', 'firstName familyName userName');

    const total = await Scholar.countDocuments({ submittedBy: req.user._id });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        success: true,
        data: scholars,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
        }
    });
});

// ============= ADMIN: GET PENDING REQUESTS =============
export const getPendingRequests = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scholars = await Scholar.find({ status: 'pending' })
        .populate('submittedBy', 'firstName familyName userName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Scholar.countDocuments({ status: 'pending' });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        success: true,
        data: scholars,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
        }
    });
});

// ============= ADMIN: APPROVE SCHOLAR =============
export const approveScholar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { notes } = req.body;

    const scholar = await Scholar.findById(id);
    if (!scholar) {
        return next(new CustomError('Savant non trouvé', 404));
    }

    if (scholar.status !== 'pending') {
        return next(new CustomError('Seules les demandes en attente peuvent être approuvées', 400));
    }

    await scholar.approve(req.user._id, notes);
    await scholar.populate('submittedBy', 'firstName familyName userName email');

    // TODO: Envoyer une notification à l'utilisateur
    // await sendNotification(scholar.submittedBy._id, 'SCHOLAR_APPROVED', scholar);

    res.status(200).json({
        success: true,
        message: 'Savant approuvé avec succès',
        data: scholar
    });
});

// ============= ADMIN: REJECT SCHOLAR =============
export const rejectScholar = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
        return next(new CustomError('La raison du rejet est requise', 400));
    }

    const scholar = await Scholar.findById(id);
    if (!scholar) {
        return next(new CustomError('Savant non trouvé', 404));
    }

    if (scholar.status !== 'pending') {
        return next(new CustomError('Seules les demandes en attente peuvent être rejetées', 400));
    }

    await scholar.reject(req.user._id, reason, notes);
    await scholar.populate('submittedBy', 'firstName familyName userName email');

    // TODO: Envoyer une notification à l'utilisateur
    // await sendNotification(scholar.submittedBy._id, 'SCHOLAR_REJECTED', scholar);

    res.status(200).json({
        success: true,
        message: 'Savant rejeté avec succès',
        data: scholar
    });
});

// ============= ADMIN: GET SCHOLAR STATS =============
export const getScholarStats = asyncHandler(async (req, res) => {
    const stats = await Scholar.getRequestStats();

    res.status(200).json({
        success: true,
        data: stats
    });
});
