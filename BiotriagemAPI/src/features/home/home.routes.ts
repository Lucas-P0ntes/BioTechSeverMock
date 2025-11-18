import { Router } from 'express';
import userRoutes from './user/user.routes';
import patientRoutes from './patient/patient.routes';

const router = Router();

// Home feature routes
router.use(userRoutes);
router.use(patientRoutes);

export default router;

