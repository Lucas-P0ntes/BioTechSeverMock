import { Request, Response } from 'express';
import { PatientListResponse, Patient } from './patient.model';

export class PatientController {
  /**
   * Mock patient list response for testing and development
   */
  static mockPatientListResponse(): PatientListResponse {
    const patients: Patient[] = [
      {
        id: 1,
        name: 'Maria Santos',
        cpf: '123.456.789-00',
        email: 'maria.santos@email.com',
        state: 'SP',
        cep: '01234-567',
        city: 'São Paulo',
        occupation: 'Enfermeira',
        phone: '(11) 98765-4321',
        observation: 'Paciente em acompanhamento',
        ethnicity: 'Branca',
        address: 'Rua das Flores',
        addressComplement: 'Apto 101',
        addressNumber: '123',
        birthday: '1990-05-15T00:00:00.000Z',
        facebookLink: null,
        foreignDocument: null,
        healthPlan: 'Unimed',
        instagramLink: null,
        levelPhysical: 'Ativo',
        whatsappLink: '(11) 98765-4321',
        gender: 'F',
        createdAt: new Date(),
        updatedAt: new Date(),
        professionalId: 1,
      },
      {
        id: 2,
        name: 'João Oliveira',
        cpf: '987.654.321-00',
        email: 'joao.oliveira@email.com',
        state: 'RJ',
        cep: '20000-000',
        city: 'Rio de Janeiro',
        occupation: 'Engenheiro',
        phone: '(21) 99876-5432',
        observation: null,
        ethnicity: 'Parda',
        address: 'Avenida Atlântica',
        addressComplement: null,
        addressNumber: '456',
        birthday: '1985-08-20T00:00:00.000Z',
        facebookLink: null,
        foreignDocument: null,
        healthPlan: 'Amil',
        instagramLink: null,
        levelPhysical: 'Moderado',
        whatsappLink: '(21) 99876-5432',
        gender: 'M',
        createdAt: new Date(),
        updatedAt: new Date(),
        professionalId: 1,
      },
      {
        id: 3,
        name: 'Ana Costa',
        cpf: '111.222.333-44',
        email: 'ana.costa@email.com',
        state: 'MG',
        cep: '30000-000',
        city: 'Belo Horizonte',
        occupation: 'Professora',
        phone: '(31) 97777-8888',
        observation: 'Primeira consulta',
        ethnicity: 'Negra',
        address: 'Rua da Paz',
        addressComplement: 'Casa',
        addressNumber: '789',
        birthday: '1992-12-10T00:00:00.000Z',
        facebookLink: null,
        foreignDocument: null,
        healthPlan: 'Bradesco Saúde',
        instagramLink: null,
        levelPhysical: 'Sedentário',
        whatsappLink: '(31) 97777-8888',
        gender: 'F',
        createdAt: new Date(),
        updatedAt: new Date(),
        professionalId: 1,
      },
    ];

    return { patients };
  }

  /**
   * Format patient to match Swift model expectations (snake_case)
   */
  private static formatPatient(patient: Patient): any {
    return {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
      email: patient.email,
      state: patient.state,
      cep: patient.cep,
      city: patient.city,
      occupation: patient.occupation,
      phone: patient.phone,
      observation: patient.observation,
      ethnicity: patient.ethnicity,
      address: patient.address,
      address_complement: patient.addressComplement,
      address_number: patient.addressNumber,
      date_born: patient.birthday,
      facebook_link: patient.facebookLink,
      foreign_document: patient.foreignDocument,
      health_plan: patient.healthPlan,
      instagram_link: patient.instagramLink,
      level_physical: patient.levelPhysical,
      whatsapp_link: patient.whatsappLink,
      gender: patient.gender,
      created_at: patient.createdAt,
      updated_at: patient.updatedAt,
      professional_id: patient.professionalId,
    };
  }

  /**
   * GET /api/patients
   * Gets patient list
   */
  static async getPatientList(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement real patient list retrieval logic here
      // For now, return mock response
      const mockResponse = PatientController.mockPatientListResponse();
      const formattedPatients = mockResponse.patients.map(patient => 
        PatientController.formatPatient(patient)
      );
      console.log('[HOME - PATIENT] Successfully received a Patient list');
      res.json({ patients: formattedPatients });
    } catch (error) {
      console.error('[HOME - PATIENT] Error retrieving Patient list:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

