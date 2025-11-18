import { Router } from 'express';
// Feature routes (BFF pattern)
import loginRoutes from '../features/login/login.routes';
import forgotPasswordRoutes from '../features/forgotPassword/forgotPassword.routes';
import homeRoutes from '../features/home/home.routes';
import patientDetailRoutes from '../features/patientDetail/patientDetail.routes';

const router = Router();

// Organize routes by feature (BFF pattern)
router.use('/api', loginRoutes);
router.use('/api', forgotPasswordRoutes);
router.use('/api', homeRoutes);
router.use('/api', patientDetailRoutes);

export default router;

