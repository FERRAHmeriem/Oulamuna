import { body, param, query } from 'express-validator';
import { Router } from 'express';
import { articleUploadCustom } from '../middlewares/uploadMiddleware.js';
const router = Router();
import {
    createArticle,
    updateArticle,
    getArticle,
    getArticles, deleteArticle, getFeaturedArticles,
} from '../controllers/articles/articleController.js';
import {
    searchByDomain,
    searchByLanguage,
    searchByEpoque,
    searchByYear,
    advancedSearch,
    searchArticlesByScholar
} from '../controllers/articles/searchController.js';
import {
    getAuthorStats,
    getAuthorMostViewed,
    getAllAuthorArticlesByViews, getArticleAnalytics, getGlobalStats,
} from '../controllers/articles/analyticsController.js';
import { toggleLike, addComment, deleteComment } from '../controllers/articles/engagementArticle.js';
import { approveArticle, rejectArticle, toggleFeature, archiveArticle, } from '../controllers/articles/adminController.js';
import protect from '../middlewares/auth.js';
import roleMiddleware from '../middlewares/role.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';
// ============= PUBLIC ROUTES =============

// Obtenir un article spécifique (public pour les articles approuvés)
router.get('/:id', optionalAuth, getArticle); // done

// Obtenir tous les articles avec pagination (public pour les articles approuvés)
router.get('/', optionalAuth, getArticles); //done

// Obtenir les articles en favoris (vedette) (not implemented yet in design but done in backend in case we need it later)
router.get('/featured/list', getFeaturedArticles); //done

// Recherche par domaine d'expertise
router.get('/search/domain/:domaine', searchByDomain); // done

// Recherche par langue
router.get('/search/language/:language', searchByLanguage); // done

// Recherche par époque
router.get('/search/epoque/:epoque', searchByEpoque); // done

// Recherche par année de publication
router.get('/search/year/:year', searchByYear); // done
// Recherche par nom de savant (auteur)
router.get('/search/scholar/:scholarName', searchArticlesByScholar); // 

// Recherche stage el wa7ch (tous les filtres combinés)
router.get('/search/advanced', advancedSearch); // done


// ============= PROTECTED ROUTES (Authentification requise) ============


// Statistiques d'un auteur 
router.get('/author/:authorId/stats', protect, getAuthorStats); //4- done

// Articles les plus vus d'un auteur 
router.get('/author/:authorId/most-viewed', protect, getAuthorMostViewed); // 5- done

// Tous les articles d'un auteur triés par vues (public)
router.get('/author/:authorId/all-by-views', protect, getAllAuthorArticlesByViews); //6- done


// Créer un nouvel article
router.post('/create', protect, articleUploadCustom, createArticle);  // 1- done 

// Mettre à jour un article
router.put('/update/:id', protect, updateArticle); // 2- done

// Supprimer un article
router.delete('/:id', protect, deleteArticle); // 3- done

// Liker/Unliker un article
router.post('/:id/like', protect, toggleLike); // done

// Ajouter un commentaire
router.post('/:id/comments', protect, addComment); // done

// Obtenir les analytics d'un article (auteur ou admin seulement)
router.get('/:id/analytics', protect, getArticleAnalytics); // done

// ============= ADMIN ROUTES =============

// Obtenir tous les articles (y compris brouillons, en attente, lsl kaml)
router.get('/admin/all', protect, roleMiddleware('admin'), getArticles); // 8- done

router.delete('/:articleId/delete-comment/:commentId', protect, deleteComment);

// Approuver un article
router.patch('/:id/approve', protect,
    roleMiddleware('admin'),
    [
        body('reviewNotes')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Les notes de révision ne peuvent pas dépasser 500 caractères')
    ],
    approveArticle
); // 7- done

// Rejeter un article
router.patch('/:id/reject', protect,
    roleMiddleware('admin'),
    [
        body('rejectionReason')
            .isLength({ min: 10, max: 500 })
            .withMessage('La raison du rejet doit contenir entre 10 et 500 caractères')
    ],
    rejectArticle
); // done


// i did this toggleFeature endpoint because:

// 1. It adds the ability for admins to highlight or "feature" specific articles on the platform
// 2. Featured articles likely get special visibility on the homepage or in dedicated sections
// 3. It helps promote high-quality or timely content that administrators want users to see

// this is not implemented in the design yet but done in the backend in case we need it later, it may add an article to the featured list or remove it from there
router.patch('/:id/feature', protect, roleMiddleware('admin'), toggleFeature); //done

// Archiver un article
router.patch('/:id/archive', protect, roleMiddleware('admin'), archiveArticle); // done

// Obtenir les statistiques globales
router.get('/admin/global-stats', protect, roleMiddleware('admin'), getGlobalStats); // done

export default router;