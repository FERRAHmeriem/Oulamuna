import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';
import Scholar from '../../models/schemas/scholar.js'; // ADD THIS IMPORT
import { validationResult } from 'express-validator';
import CustomError from '../../utils/customError.js';

// ============= CREATE ARTICLE (MODIFIED) =============
export const createArticle = asyncHandler(async (req, res, next) => {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError('Erreurs de validation', 400));
    }

    const {
        title,
        description,
        scholarName, // For backward compatibility
        scholar, // New field for Scholar reference
        epoque,
        articleLanguage,
        domaineExpertise,
        imageArticle,
        sections,
        pdfFiles
    } = req.body;

    // Créer l'article - initial data structure
    const articleData = {
        title,
        description,
        epoque,
        articleLanguage,
        domaineExpertise,
        imageArticle,
        sections: sections || [],
        pdfFiles: pdfFiles || [],
        author: req.user._id,
        status: 'draft'
    };

    if (scholar) {
        // If using new Scholar system
        const scholarDoc = await Scholar.findById(scholar);
        if (!scholarDoc) {
            return next(new CustomError('Savant non trouvé', 404));
        }
        if (scholarDoc.status !== 'approved') {
            return next(new CustomError('Le savant doit être approuvé avant de pouvoir écrire des articles', 400));
        }
        // Ensure consistency
        if (epoque !== scholarDoc.epoque || domaineExpertise !== scholarDoc.domaineExpertise) {
            return next(new CustomError('L\'époque et le domaine d\'expertise doivent correspondre au savant sélectionné', 400));
        }

        // Set scholar reference
        articleData.scholar = scholar;
        articleData.scholarName = scholarDoc.name;
    } else if (scholarName) {
        // Validate that the scholarName exists among approved scholars
        const existingScholar = await Scholar.findOne({
            name: scholarName,
            status: 'approved'
        });

        if (!existingScholar) {
            return next(new CustomError('Le nom du savant fourni n\'existe pas parmi les savants approuvés', 400));
        }

        // Set both the scholar reference and scholarName
        articleData.scholar = existingScholar._id;
        articleData.scholarName = scholarName;
    } else {
        return next(new CustomError('Vous devez soit sélectionner un savant approuvé, soit saisir un nom de savant', 400));
    }

    const article = new Article(articleData);
    const savedArticle = await article.save();

    await savedArticle.populate([
        { path: 'author', select: 'firstName familyName userName email' },
        { path: 'scholar', select: 'name epoque domaineExpertise picture' }
    ]);

    res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: savedArticle
    });
});

// ============= UPDATE ARTICLE (MODIFIED) =============
export const updateArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError('Erreurs de validation', 400));
    }

    // Vérifier si l'article existe
    const article = await Article.findById(id);
    if (!article) {
        return next(new CustomError('Article non trouvé', 404));
    }

    // Vérifier si l'utilisateur est l'auteur ou admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new CustomError('Accès refusé. Vous ne pouvez modifier que vos propres articles', 403));
    }

    // Empêcher la modification d'articles approuvés par des non-admins
    if (article.status === 'approved' && req.user.role !== 'admin') {
        return next(new CustomError('Impossible de modifier un article approuvé', 403));
    }

    // Check scholarName validity if it's being modified
    if (req.body.scholarName) {
        // Validate that the new scholarName exists among approved scholars
        const existingScholar = await Scholar.findOne({
            name: req.body.scholarName,
            status: 'approved'
        });

        if (!existingScholar) {
            return next(new CustomError('Le nom du savant fourni n\'existe pas parmi les savants approuvés', 400));
        }
    }

    if (req.body.scholar) {
        delete req.body.scholar;
    }

    const allowedUpdates = [
        'title', 'description', 'scholarName', 'epoque', 'articleLanguage',
        'domaineExpertise', 'imageArticle', 'sections', 'pdfFiles'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    // Si l'article était rejeté et qu'il est modifié, le remettre en brouillon
    if (article.status === 'rejected') {
        updates.status = 'draft';
        updates.adminReview = undefined;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    ).populate([
        { path: 'author', select: 'firstName familyName userName email' },
        { path: 'scholar', select: 'name epoque domaineExpertise picture' }
    ]);

    res.status(200).json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: updatedArticle
    });
});

// ============= GET SINGLE ARTICLE (MODIFIED) =============
export const getArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id)
        .populate('author', 'firstName familyName userName email profilePicture')
        .populate({ 
            path: 'scholar', 
            select: 'name epoque domaineExpertise picture status articlesCount createdAt approvedAt',
            options: { virtuals: true } 
        })
        .populate('comments.author', 'firstName familyName userName profilePicture')
        .populate('likes.user', 'firstName familyName userName')
        .populate('adminReview.reviewedBy', 'firstName familyName userName');

    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    // Seuls les articles approuvés sont visibles publiquement
    // L'auteur et les admins peuvent voir tous leurs articles
    const canView = article.status === 'approved' ||
        article.author._id.toString() === req.user?._id?.toString() ||
        req.user?.role === 'admin';

    if (!canView) {
        return res.status(403).json({
            success: false,
            message: 'Article non accessible'
        });
    }

    // Incrémenter le nombre de vues si l'article est approuvé et ce n'est pas l'auteur
    if (article.status === 'approved' &&
        (!req.user || article.author._id.toString() !== req.user._id.toString())) {

        const clientIp = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        console.log(`Article viewed by IP: ${clientIp}, User-Agent: ${userAgent}`);

        await article.incrementView(req.user?._id, clientIp, userAgent);
    }

    res.status(200).json({
        success: true,
        data: article
    });
});

// ============= GET ALL ARTICLES (MODIFIED) =============
export const getArticles = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    // Seuls les articles approuvés sont visibles publiquement (sauf pour les admins)
    if (req.user?.role !== 'admin') {
        query.status = 'approved';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const articles = await Article.find(query)
        .populate('author', 'firstName familyName userName profilePicture')
        .populate('scholar', 'name epoque domaineExpertise picture status articlesCount createdAt approvedAt') // ghir jdid: Populate scholar
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        success: true,
        data: articles,
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

// ============= DELETE ARTICLE (MODIFIED) =============
export const deleteArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    // Vérifier les permissions
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé'
        });
    }

    // // ghir jdid: Decrement scholar's article count if using Scholar system
    // if (article.scholar) {
    //     const scholar = await Scholar.findById(article.scholar);
    //     if (scholar) {
    //         await scholar.decrementArticleCount();
    //     }
    // }

    await Article.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Article supprimé avec succès'
    });
});

// ============= GET FEATURED ARTICLES (MODIFIED) =============
export const getFeaturedArticles = asyncHandler(async (req, res, next) => {
    const { limit = 5 } = req.query;

    const articles = await Article.find({
        featured: true,
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .populate('scholar', 'name epoque domaineExpertise picture status articlesCount createdAt approvedAt') // ghir jdid tan: Populate scholar
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit));

    res.status(200).json({
        success: true,
        data: articles
    });
});