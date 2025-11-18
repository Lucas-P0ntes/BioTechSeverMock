import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { ExamController } from '../controllers/ExamController';

const router = Router();

router.get('/patients', PatientController.getPatientList);
router.get('/patients/:cpf/exams', ExamController.getExamsForPatient);
router.post('/patients/:cpf/exams', ExamController.postExam);

export default router;

