import { Request, Response } from 'express';
import { ExamListResponse, Exam, ScanExam, Measure } from '../models/Exam';

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
   * Debug method to get storage info (for development only)
   */
  static getStorageInfo(): any {
    const info: any = {};
    ExamController.examsStorage.forEach((exams, cpf) => {
      info[cpf] = {
        count: exams.length,
        exams: exams.map(e => ({ id: e.id, name: e.name, date: e.date }))
      };
    });
    return info;
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
      objeto: null, // Will be populated from database if needed
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

      console.log(`[EXAM CONTROLLER] GET request for CPF: "${cpf}" (normalized: "${normalizedCPF}")`);
      console.log(`[EXAM CONTROLLER] Mock exams found: ${mockExams.length}`);
      console.log(`[EXAM CONTROLLER] Saved exams found: ${savedExams.length}`);
      console.log(`[EXAM CONTROLLER] Total exams: ${formattedExams.length}`);
      console.log(`[EXAM CONTROLLER] All storage keys: [${Array.from(ExamController.examsStorage.keys()).join(', ')}]`);
      if (savedExams.length > 0) {
        console.log(`[EXAM CONTROLLER] Saved exam IDs: [${savedExams.map(e => e.id).join(', ')}]`);
      }
      res.json({ exams: formattedExams });
    } catch (error) {
      console.error('[EXAM CONTROLLER] Error retrieving Exam list:', error);
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
      console.log(`[EXAM CONTROLLER] Received exam POST for CPF: ${cpf} (normalized: ${normalizedCPF})`);
      console.log(`[EXAM CONTROLLER] Exam type: ${exam.type}, name: ${exam.name}`);
      console.log(`[EXAM CONTROLLER] Exam date: ${exam.date || 'not provided'}`);
      console.log(`[EXAM CONTROLLER] Has objeto: ${exam.objeto ? exam.objeto.length + ' file(s)' : 'no'}`);
      console.log(`[EXAM CONTROLLER] Has measures: ${exam.measures ? exam.measures.length + ' measure(s)' : 'no'}`);

      // Cria o exame completo para armazenar
      const examId = exam.id || `exam_${Date.now()}`;
      const examDate = exam.date || new Date().toISOString();
      
      const examToSave: Exam = {
        id: examId,
        picture: exam.picture ?? null,
        type: exam.type,
        name: exam.name,
        date: examDate,
        measures: exam.measures || [],
      };

      // Salva o exame em memória (agrupado por CPF normalizado do paciente)
      if (!ExamController.examsStorage.has(normalizedCPF)) {
        ExamController.examsStorage.set(normalizedCPF, []);
      }
      ExamController.examsStorage.get(normalizedCPF)!.push(examToSave);

      const savedExamsArray = ExamController.examsStorage.get(normalizedCPF)!;
      console.log(`[EXAM CONTROLLER] ✅ Exam saved successfully to memory storage`);
      console.log(`[EXAM CONTROLLER] Exam ID: ${examId}`);
      console.log(`[EXAM CONTROLLER] Total exams for CPF "${normalizedCPF}": ${savedExamsArray.length}`);
      console.log(`[EXAM CONTROLLER] All stored CPFs: [${Array.from(ExamController.examsStorage.keys()).join(', ')}]`);
      console.log(`[EXAM CONTROLLER] Exam details: name="${exam.name}", date="${examDate}", type="${exam.type}"`);

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
    } catch (error) {
      console.error('[EXAM CONTROLLER] Error posting exam:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

