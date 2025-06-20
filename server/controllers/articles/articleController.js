import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';
import { validationResult } from 'express-validator';
import CustomError from '../../utils/customError.js';

// ============= CREATE ARTICLE =============
export const createArticle = asyncHandler(async (req, res, next) => {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError('Erreurs de validation', 400));
    }

    const {
        title,
        description,
        scholarName,
        epoque,
        articleLanguage,
        domaineExpertise,
        imageArticle,
        sections,
        pdfFiles
    } = req.body;

    // Créer l'article
    const article = new Article({
        title,
        description,
        scholarName,
        epoque,
        articleLanguage,
        domaineExpertise,
        imageArticle,
        sections: sections || [],
        pdfFiles: pdfFiles || [],
        author: req.user._id,
        status: 'draft'
    });

    const savedArticle = await article.save();
    await savedArticle.populate('author', 'firstName familyName userName email');

    res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: savedArticle
    });
});

// ============= UPDATE ARTICLE =============
export const updateArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            errors: errors.array()
        });
    }

    // Vérifier si l'article existe
    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    // Vérifier si l'utilisateur est l'auteur ou admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé. Vous ne pouvez modifier que vos propres articles'
        });
    }

    // Empêcher la modification d'articles approuvés par des non-admins
    if (article.status === 'approved' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Impossible de modifier un article approuvé'
        });
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
    ).populate('author', 'firstName familyName userName email');

    res.status(200).json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: updatedArticle
    });
});

// ============= GET SINGLE ARTICLE =============
export const getArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    

    const article = await Article.findById(id)
        .populate('author', 'firstName familyName userName email profilePicture')
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
      
    // Incrémenter le nombre de vues si l'article est approuvé et ce n'est pas l'auteur, c'est une autre personne qui le consulte que ça soit authentifié ou non
    if (article.status === 'approved' &&
        (!req.user || article.author._id.toString() !== req.user._id.toString())) {
            
        const clientIp = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        //to test 
        console.log(`Article viewed by IP: ${clientIp}, User-Agent: ${userAgent}`);

        await article.incrementView(req.user?._id, clientIp, userAgent);
    }

    res.status(200).json({
        success: true,
        data: article
    });
});

// ============= GET ALL ARTICLES  =============
export const getArticles = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
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

// ============= DELETE ARTICLE =============
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

    await Article.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Article supprimé avec succès'
    });
});

// ============= GET FEATURED ARTICLES =============
export const getFeaturedArticles = asyncHandler(async (req, res, next) => {
    const { limit = 5 } = req.query;

    const articles = await Article.find({
        featured: true,
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit));

    res.status(200).json({
        success: true,
        data: articles
    });
});
