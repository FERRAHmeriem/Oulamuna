import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';


// =============  ADMIN CONTROLLER METHODS =============

// Approuver un article
export const approveArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reviewNotes } = req.body;

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    if (article.status === 'approved') {
        return res.status(400).json({
            success: false,
            message: 'Article déjà approuvé'
        });
    }

    article.status = 'approved';
    article.publishedAt = new Date();
    article.adminReview = {
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || ''
    };

    await article.save();
    await article.populate('author', 'firstName familyName userName email');

    res.status(200).json({
        success: true,
        message: 'Article approuvé avec succès',
        data: article
    });
});

// Rejeter un article
export const rejectArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    article.status = 'rejected';
    article.adminReview = {
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        rejectionReason
    };

    await article.save();
    await article.populate('author', 'firstName familyName userName email');

    res.status(200).json({
        success: true,
        message: 'Article rejeté',
        data: article
    });
});

// Mettre en vedette / retirer de la vedette
export const toggleFeature = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    if (article.status !== 'approved') {
        return res.status(400).json({
            success: false,
            message: 'Seuls les articles approuvés peuvent être mis en vedette'
        });
    }

    article.featured = !article.featured;
    await article.save();

    res.status(200).json({
        success: true,
        message: article.featured ? 'Article mis en vedette' : 'Article retiré de la vedette',
        data: { featured: article.featured }
    });
});

// Archiver un article
export const archiveArticle = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    article.status = 'archived';
    await article.save();

    res.status(200).json({
        success: true,
        message: 'Article archivé avec succès',
        data: article
    });
});

