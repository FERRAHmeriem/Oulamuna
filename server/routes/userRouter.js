import { Router } from 'express';
const router = Router();
import { login, signupStepOne, signupStepTwo, signupStepThree, signupStepFour, verifyEmail } from '../controllers/userController.js';
import { upload } from '../config/multer.js';

router.post('/signup-first-step', signupStepOne);
router.post('/signup-second-step', signupStepTwo);
router.post('/signup-third-step',  upload.single('profileImage'), signupStepThree);
router.post('/signup-fourth-step', signupStepFour);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

export default router