import asyncHandler from 'express-async-handler';
import Article from '../../models/schemas/article.js';
import Scholar from '../../models/schemas/scholar.js';

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

// ============= SEARCH ARTICLES BY SCHOLAR NAME ============= // not done
export const searchArticlesByScholar = asyncHandler(async (req, res, next) => {
    const { scholarName } = req.params;
    const {
        page = 1,
        limit = 10,
        sortBy = 'publishedAt',
        sortOrder = 'desc'
    } = req.query;

    // Vérifier que le nom du savant est fourni
    if (!scholarName || scholarName.trim() === '') {
        return next(new CustomError('Nom du savant requis', 400));
    }

    // Rechercher le savant par nom (recherche flexible)
    const scholar = await Scholar.findOne({
        name: { $regex: scholarName.trim(), $options: 'i' },
        status: 'approved'
    });

    if (!scholar) {
        return next(new CustomError('Savant non trouvé ou non accessible', 404));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const articles = await Article.find({
        scholar: scholar._id,
        status: 'approved'
    })
        .populate('author', 'firstName familyName userName profilePicture')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Article.countDocuments({
        scholar: scholar._id,
        status: 'approved'
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        success: true,
        data: {
            scholar,
            articles,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});
// ============= ADVANCED SEARCH ============= // to review
export const advancedSearch = asyncHandler(async (req, res, next) => {
    const {
        domaine,
        language,
        epoque,
        year,
        scholarName,
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

    // Filtre par nom de savant
    if (scholarName && scholarName.trim() !== '') {
        // Rechercher d'abord le(s) savant(s) correspondant(s)
        const scholars = await Scholar.find({
            name: { $regex: scholarName.trim(), $options: 'i' },
            status: 'approved'
        }).select('_id');

        if (scholars.length > 0) {
            const scholarIds = scholars.map(scholar => scholar._id);
            query.scholar = { $in: scholarIds };
        } else {
            // Aucun savant trouvé, retourner des résultats vides
            return res.status(200).json({
                success: true,
                data: [],
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: 0,
                    totalItems: 0,
                    itemsPerPage: parseInt(limit)
                },
                searchCriteria: { domaine, language, epoque, year, scholarName },
                message: 'Aucun savant trouvé avec ce nom'
            });
        }
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
        searchCriteria: { domaine, language, epoque, year, scholarName }
    });
});