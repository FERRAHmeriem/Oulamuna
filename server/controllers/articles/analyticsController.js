import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';
import { User } from '../../models/schemas/user.js';
// ============= GET AUTHOR STATS =============
export const getAuthorStats = asyncHandler(async (req, res, next) => {
    const { authorId } = req.params;

    // Vérifier si l'auteur existe
    const author = await User.findById(authorId);
    if (!author) {
        return res.status(404).json({
            success: false,
            message: 'Auteur non trouvé'
        });
    }

    // Obtenir les statistiques
    const stats = await Article.getAuthorStats(authorId);

    res.status(200).json({
        success: true,
        data: {
            author: {
                _id: author._id,
                firstName: author.firstName,
                familyName: author.familyName,
                userName: author.userName,
                email: author.email,
                profilePicture: author.profilePicture
            },
            statistics: stats || {
                totalArticles: 0,
                totalLikes: 0,
                totalComments: 0,
                totalViews: 0,
                totalReadingTime: 0,
                uniqueDomainesCount: 0,
                domainesExpertise: [],
                approvedArticles: 0,
                draftArticles: 0,
                pendingArticles: 0,
                rejectedArticles: 0
            }
        }
    });
});

// ============= GET AUTHOR'S MOST VIEWED ARTICLES (Top 3) =============
export const getAuthorMostViewed = asyncHandler(async (req, res, next) => {
    const { authorId } = req.params;
    const { limit = 3 } = req.query;

    // Vérifier si l'auteur existe
    const author = await User.findById(authorId);
    if (!author) {
        return res.status(404).json({
            success: false,
            message: 'Auteur non trouvé'
        });
    }

    const articles = await Article.getMostViewedByAuthor(authorId, parseInt(limit));

    res.status(200).json({
        success: true,
        data: articles,
        author: {
            _id: author._id,
            firstName: author.firstName,
            familyName: author.familyName,
            userName: author.userName
        }
    });
});

// ============= GET ALL AUTHOR'S ARTICLES SORTED BY VIEWS =============
export const getAllAuthorArticlesByViews = asyncHandler(async (req, res, next) => {
    const { authorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Vérifier si l'auteur existe
    const author = await User.findById(authorId);
    if (!author) {
        return res.status(404).json({
            success: false,
            message: 'Auteur non trouvé'
        });
    }

    const articles = await Article.getAllByAuthorSortedByViews(
        authorId,
        parseInt(limit),
        skip
    );

    const total = await Article.countDocuments({
        author: authorId,
        status: 'approved'
    });

    res.status(200).json({
        success: true,
        data: articles,
        author: {
            _id: author._id,
            firstName: author.firstName,
            familyName: author.familyName,
            userName: author.userName
        },
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        }
    });
});

// ============= GET ARTICLE ANALYTICS =============
export const getArticleAnalytics = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id)
        .populate('author', 'firstName familyName userName')
        .populate('viewers.user', 'firstName familyName userName');

    if (!article) {
        return res.status(404).json({
            success: false,
            message: 'Article non trouvé'
        });
    }

    // Vérifier les permissions
    if (article.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé'
        });
    }

    // Statistiques détaillées
    const analytics = {
        basic: {
            viewCount: article.viewCount,
            likesCount: article.likesCount,
            commentsCount: article.commentsCount,
            readingTime: article.readingTime
        },
        engagement: {
            likeRate: article.viewCount > 0 ? (article.likesCount / article.viewCount * 100).toFixed(2) : 0,
            commentRate: article.viewCount > 0 ? (article.commentsCount / article.viewCount * 100).toFixed(2) : 0
        },
        tenRecentViews: article.viewers.slice(-10), // 10 dernières vues
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
    };

    res.status(200).json({
        success: true,
        data: analytics
    });
});

// Statistiques globales
export const getGlobalStats = asyncHandler(async (req, res, next) => {

    //stats for all states of articles
    const stats = await Article.aggregate([
        {
            $group: {
                _id: null,
                totalArticles: { $sum: 1 },
                approvedArticles: {
                    $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                },
                pendingArticles: {
                    $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                },
                draftArticles: {
                    $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
                },
                rejectedArticles: {
                    $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                },
                featuredArticles: {
                    $sum: { $cond: ['$featured', 1, 0] }
                },
                totalViews: { $sum: '$viewCount' },
                totalLikes: { $sum: { $size: '$likes' } },
                totalComments: { $sum: { $size: '$comments' } },
                avgReadingTime: { $avg: '$readingTime' }
            }
        }
    ]);

    //stats for only approved articles

    const domainStats = await Article.aggregate([
        { $match: { status: 'approved' } },
        {
            $group: {
                _id: '$domaineExpertise',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    const languageStats = await Article.aggregate([
        { $match: { status: 'approved' } },
        {
            $group: {
                _id: '$articleLanguage',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    const epoqueStats = await Article.aggregate([
        { $match: { status: 'approved' } },
        {
            $group: {
                _id: '$epoque',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.status(200).json({
        success: true,
        data: {
            general: stats[0] || {},
            byDomain: domainStats,
            byLanguage: languageStats,
            byEpoque: epoqueStats
        }
    });
});
