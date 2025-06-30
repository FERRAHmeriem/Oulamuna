import { Router } from 'express';
const router = Router();
import { login, signup, verifyEmail } from '../controllers/userController.js';
import { upload } from '../config/multer.js';


router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

export default router