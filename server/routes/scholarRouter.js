import express from 'express';
import {
    submitScholarRequest,
    getApprovedScholars,
    searchScholars,
    getScholar,
    getUserScholarRequests,
    getPendingRequests,
    approveScholar,
    rejectScholar,
    getScholarStats,
} from '../controllers/scholarController.js';
import protect from '../middlewares/auth.js';
import roleMiddleware from '../middlewares/role.js';

const router = express.Router();

// ============= PUBLIC ROUTES =============
// Get all approved scholars  and pagination
router.get('/', getApprovedScholars); //done

// Search scholars by name, epoque, or domaine
router.get('/search', searchScholars); //done

// Get single scholar (public access for approved scholars)
router.get('/:id', getScholar); //done

// ============= PROTECTED ROUTES (USER) =============
// Submit a new scholar request
router.post('/submit-scholar', protect, submitScholarRequest); //done

// Get user's own scholar requests
router.get('/user/requests', protect, getUserScholarRequests); // not gonna test this now

// ============= ADMIN ROUTES =============
// Get pending scholar requests (admin only)
router.get('/admin/pending', protect, roleMiddleware('admin'), getPendingRequests); //done

// Get scholar statistics (admin only)
router.get('/admin/stats', protect, roleMiddleware('admin'), getScholarStats); //done

// Approve a scholar request (admin only)
router.patch('/:id/approve', protect, roleMiddleware('admin'), approveScholar); //done

// Reject a scholar request (admin only)
router.patch('/:id/reject', protect, roleMiddleware('admin'), rejectScholar); //done

export default router;