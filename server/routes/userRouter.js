import { Router } from 'express';
const router = Router();
import { login, signup, verifyEmail , logout , getUserById ,updateProfile } from '../controllers/userController.js';
import { upload } from '../config/multer.js';
import protect from '../middlewares/auth.js';

router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);
router.post('/logout', logout); 
router.patch('/update/:userId', protect , upload.single("profileImage"),updateProfile); 
router.get('/verify-email/:token', verifyEmail);
router.get('/:id', protect , getUserById);


export default router