import { Router } from 'express';
import { ExamController } from './exam.controller';

const router = Router();

router.get('/patients/:cpf/exams', ExamController.getExamsForPatient);
router.post('/patients/:cpf/exams', ExamController.postExam);

export default router;

