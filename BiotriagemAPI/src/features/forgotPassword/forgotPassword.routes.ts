import { Router } from 'express';
import { ForgotPasswordController } from './forgotPassword.controller';

const router = Router();

router.post('/forgot-password', ForgotPasswordController.forgotPassword);

export default router;

