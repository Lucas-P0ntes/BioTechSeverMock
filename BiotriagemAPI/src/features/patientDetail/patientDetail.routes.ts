import { Router } from 'express';
import examRoutes from './exam/exam.routes';

const router = Router();

// PatientDetail feature routes
router.use(examRoutes);

export default router;

