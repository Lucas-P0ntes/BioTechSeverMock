import { Request, Response } from 'express';
import { ExamListResponse, Exam, ScanExam } from './exam.model';

export class ExamController {
  /**
   * In-memory storage for exams (key: patient CPF, value: array of exams)
   * In production, this would be replaced with a database
   */
  private static examsStorage: Map<string, Exam[]> = new Map();

  /**
   * Normalizes CPF by removing dots and dashes for consistent storage/retrieval
   */
  private static normalizeCPF(cpf: string): string {
    if (!cpf) return '';
    // Remove pontos, traços e espaços
    return cpf.replace(/[.\-\s]/g, '');
  }

  /**
   * Mock exam list response for testing and development
   */
  static mockExamListResponse(patientCPF: string): ExamListResponse {
    const exams: Exam[] = [
      {
        id: 'exam_1',
        picture: 'OBJ_FILES/Scan_do_Pe_Direito.obj',
        type: 'scan',
        name: 'Scan do Pé Direito',
        date: '2024-01-15T10:30:00.000Z',
        measures: [
          {
            name: 'Comprimento',
            distance: 0.255,
            firstPoint: null,
            lastPoint: null,
          },
          {
            name: 'Largura',
            distance: 0.102,
            firstPoint: null,
            lastPoint: null,
          },
        ],
      },
      {
        id: 'exam_2',
        picture: 'OBJ_FILES/Scan_do_Pe_Esquerdo.obj',
        type: 'scan',
        name: 'Scan do Pé Esquerdo',
        date: '2024-01-10T14:20:00.000Z',
        measures: [
          {
            name: 'Comprimento',
            distance: 0.25,
            firstPoint: null,
            lastPoint: null,
          },
          {
            name: 'Largura',
            distance: 0.1,
            firstPoint: null,
            lastPoint: null,
          },
        ],
      },
    ];

    return { exams };
  }

  /**
   * Format exam to match Swift model expectations
   */
  private static formatExam(exam: Exam): any {
    return {
      id: exam.id,
      picture: exam.picture,
      tipo: exam.type,
      nome: exam.name,
      data: exam.date,
      measures: exam.measures,
      objeto: exam.objeto || null, // Retorna o objeto se existir
    };
  }

  /**
   * GET /api/patients/:cpf/exams
   * Gets exams for a specific patient
   */
  static async getExamsForPatient(req: Request, res: Response): Promise<void> {
    try {
      const { cpf } = req.params;

      if (!cpf) {
        res.status(400).json({
          error: 'Patient CPF is required',
        });
        return;
      }

      // Normaliza o CPF para garantir consistência
      const normalizedCPF = ExamController.normalizeCPF(cpf);

      // Pega exames mock iniciais
      const mockResponse = ExamController.mockExamListResponse(cpf);
      const mockExams = mockResponse.exams || [];

      // Pega exames salvos via POST (em memória) usando CPF normalizado
      const savedExams = ExamController.examsStorage.get(normalizedCPF) || [];

      // Combina exames mock com exames salvos
      const allExams = [...mockExams, ...savedExams];

      // Formata os exames para o formato esperado pelo Swift
      const formattedExams = allExams.map(exam => 
        ExamController.formatExam(exam)
      );

      console.log(`[PATIENT DETAIL - EXAM] GET request for CPF: "${cpf}" (normalized: "${normalizedCPF}")`);
      console.log(`[PATIENT DETAIL - EXAM] Mock exams found: ${mockExams.length}`);
      console.log(`[PATIENT DETAIL - EXAM] Saved exams found: ${savedExams.length}`);
      console.log(`[PATIENT DETAIL - EXAM] Total exams: ${formattedExams.length}`);
      console.log(`[PATIENT DETAIL - EXAM] All storage keys: [${Array.from(ExamController.examsStorage.keys()).join(', ')}]`);
      if (savedExams.length > 0) {
        console.log(`[PATIENT DETAIL - EXAM] Saved exam IDs: [${savedExams.map(e => e.id).join(', ')}]`);
      }

      res.json({ exams: formattedExams });
    } catch (error) {
      console.error('[PATIENT DETAIL - EXAM] Error retrieving Exam list:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/patients/:cpf/exams
   * Posts a new exam for a patient
   */
  static async postExam(req: Request, res: Response): Promise<void> {
    try {
      const { cpf } = req.params;
      const exam: ScanExam = req.body;

      if (!cpf) {
        res.status(400).json({
          error: 'Patient CPF is required',
        });
        return;
      }

      // Validação mais flexível - permite exames sem picture (scans podem não ter picture)
      if (!exam || !exam.type || !exam.name) {
        res.status(400).json({
          error: 'Exam data is required (type, name)',
        });
        return;
      }

      // Normaliza o CPF para garantir consistência
      const normalizedCPF = ExamController.normalizeCPF(cpf);

      // Log dos dados recebidos para debug
      console.log(`[PATIENT DETAIL - EXAM] Received exam POST for CPF: ${cpf} (normalized: ${normalizedCPF})`);
      console.log(`[PATIENT DETAIL - EXAM] Exam type: ${exam.type}, name: ${exam.name}`);
      console.log(`[PATIENT DETAIL - EXAM] Exam date: ${exam.date || 'not provided'}`);
      if (exam.objeto) {
        const totalSize = exam.objeto.reduce((sum, str) => sum + (str?.length || 0), 0);
        console.log(`[PATIENT DETAIL - EXAM] Has objeto: ${exam.objeto.length} file(s), total size: ~${Math.round(totalSize / 1024)}KB`);
      } else {
        console.log(`[PATIENT DETAIL - EXAM] Has objeto: no`);
      }
      console.log(`[PATIENT DETAIL - EXAM] Has measures: ${exam.measures ? exam.measures.length + ' measure(s)' : 'no'}`);

      // Cria o exame completo para armazenar
      // NOTA: Estamos salvando o objeto em memória para desenvolvimento
      // Em produção, salvaria em storage (S3, etc) e armazenaria apenas a referência
      const examId = exam.id || `exam_${Date.now()}`;
      const examDate = exam.date || new Date().toISOString();
      
      const examToSave: Exam = {
        id: examId,
        picture: exam.picture ?? null,
        type: exam.type,
        name: exam.name,
        date: examDate,
        measures: exam.measures || [],
        objeto: exam.objeto || null, // Salva o objeto (array de strings base64)
      };
      
      // Log do tamanho do objeto para debug
      if (exam.objeto && exam.objeto.length > 0) {
        const objetoSize = exam.objeto.reduce((sum, str) => sum + (str?.length || 0), 0);
        console.log(`[PATIENT DETAIL - EXAM] ✅ OBJ file received and saved (${Math.round(objetoSize / 1024)}KB)`);
        console.log(`[PATIENT DETAIL - EXAM] ⚠️  In production, save OBJ to file storage (S3, etc) and store reference in database`);
      }

      // Salva o exame em memória (agrupado por CPF normalizado do paciente)
      if (!ExamController.examsStorage.has(normalizedCPF)) {
        ExamController.examsStorage.set(normalizedCPF, []);
      }
      ExamController.examsStorage.get(normalizedCPF)!.push(examToSave);

      const savedExamsArray = ExamController.examsStorage.get(normalizedCPF)!;
      console.log(`[PATIENT DETAIL - EXAM] ✅ Exam saved successfully to memory storage`);
      console.log(`[PATIENT DETAIL - EXAM] Exam ID: ${examId}`);
      console.log(`[PATIENT DETAIL - EXAM] Total exams for CPF "${normalizedCPF}": ${savedExamsArray.length}`);
      console.log(`[PATIENT DETAIL - EXAM] All stored CPFs: [${Array.from(ExamController.examsStorage.keys()).join(', ')}]`);
      console.log(`[PATIENT DETAIL - EXAM] Exam details: name="${exam.name}", date="${examDate}", type="${exam.type}"`);

      res.json({ 
        success: true,
        message: 'Exam saved successfully',
        exam: {
          id: examId,
          type: exam.type,
          name: exam.name,
          date: examDate,
        }
      });
    } catch (error: any) {
      console.error('[PATIENT DETAIL - EXAM] ❌ Error posting exam:', error);
      console.error('[PATIENT DETAIL - EXAM] Error message:', error?.message);
      console.error('[PATIENT DETAIL - EXAM] Error stack:', error?.stack);
      res.status(500).json({
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
      });
    }
  }
}

