import { Router } from 'express';
const router = Router();
import { login, signup, verifyEmail, updateProfile } from '../controllers/userController.js';
import { upload } from '../config/multer.js';
import protect from '../middlewares/auth.js';


router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.put('/update-profile/:userId', protect, upload.single('profileImage'), updateProfile);

export default router