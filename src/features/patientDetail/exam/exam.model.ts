export interface Measure {
  name: string;
  distance: number;
  firstPoint: number[] | null;
  lastPoint: number[] | null;
}

export interface Exam {
  id: string;
  picture: string | null;
  type: string;
  name: string;
  date: string;
  measures: Measure[];
  objeto?: string[] | null; // Array de strings base64 dos arquivos OBJ
}

export interface ExamListResponse {
  exams: Exam[];
}

export interface ScanExam {
  id?: string;
  picture?: string | null;
  type: string;
  name: string;
  date?: string;
  measures?: Measure[];
  objeto?: string[]; // Array de strings base64 dos arquivos OBJ
}

