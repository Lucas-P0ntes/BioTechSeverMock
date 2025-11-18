export interface Patient {
  id: number;
  name: string;
  cpf: string;
  email: string;
  state: string;
  cep: string;
  city: string;
  occupation: string;
  phone: string;
  observation: string | null;
  ethnicity: string;
  address: string;
  addressComplement: string | null;
  addressNumber: string;
  birthday: string;
  facebookLink: string | null;
  foreignDocument: string | null;
  healthPlan: string;
  instagramLink: string | null;
  levelPhysical: string;
  whatsappLink: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  professionalId: number;
}

export interface PatientListResponse {
  patients: Patient[];
}

