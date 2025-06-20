import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';

// ============= SEARCH BY DOMAIN OF EXPERTISE =============
export const searchByDomain = asyncHandler(async (req, res, next) => {
    const { domaine } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const articles = await Article.find({
        domaineExpertise: domaine,
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments({
        domaineExpertise: domaine,
        status: 'approved'
    });

    res.status(200).json({
        success: true,
        data: articles,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        },
        searchCriteria: { domaineExpertise: domaine }
    });
});

// ============= SEARCH BY LANGUAGE =============
export const searchByLanguage = asyncHandler(async (req, res, next) => {
    const { language } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const articles = await Article.find({
        articleLanguage: language,
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments({
        articleLanguage: language,
        status: 'approved'
    });

    res.status(200).json({
        success: true,
        data: articles,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        },
        searchCriteria: { language }
    });
});

// ============= SEARCH BY EPOQUE =============
export const searchByEpoque = asyncHandler(async (req, res, next) => {
    const { epoque } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const articles = await Article.find({
        epoque: epoque,
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments({
        epoque: epoque,
        status: 'approved'
    });

    res.status(200).json({
        success: true,
        data: articles,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        },
        searchCriteria: { epoque }
    });
});

// ============= SEARCH BY PUBLICATION YEAR =============
export const searchByYear = asyncHandler(async (req, res, next) => {
    const { year } = req.params;
    const { page = 1, limit = 10, sortBy = 'publishedAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Créer les dates de début et fin de l'année
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    const articles = await Article.find({
        publishedAt: {
            $gte: startOfYear,
            $lte: endOfYear
        },
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments({
        publishedAt: {
            $gte: startOfYear,
            $lte: endOfYear
        },
        status: 'approved'
    });

    res.status(200).json({
        success: true,
        data: articles,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        },
        searchCriteria: { year: parseInt(year) }
    });
});

// ============= ADVANCED SEARCH =============
export const advancedSearch = asyncHandler(async (req, res, next) => {
    const {
        domaine,
        language,
        epoque,
        year,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { status: 'approved' };

    // Filtres
    if (domaine) query.domaineExpertise = domaine;
    if (language) query.articleLanguage = language;
    if (epoque) query.epoque = epoque;

    // Filtre par année
    if (year) {
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        query.publishedAt = {
            $gte: startOfYear,
            $lte: endOfYear
        };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const articles = await Article.find(query)
        .populate('author', 'firstName familyName userName profilePicture')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments(query);

    res.status(200).json({
        success: true,
        data: articles,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        },
        searchCriteria: { domaine, language, epoque, year }
    });
});
