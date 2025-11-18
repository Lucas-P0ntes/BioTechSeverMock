import { Router } from 'express';
import { PatientController } from './patient.controller';

const router = Router();

router.get('/patients', PatientController.getPatientList);

export default router;

