import { BusinessArea } from './business-area.interface';

export interface Entrepreneur {
  id?: string;
  cnpj?: string;
  companyName: string;
  description: string;
  email: string;
  phone: string;
  registrationDate?: string;
  foundedYear?: string;
  city?: string;
  state?: string;
  segment?: string;
  employees?: number;
  taxId?: string;
  // Many-to-Many relationships
  businessAreas?: BusinessArea[];
}

export interface RelationshipDto {
  id: string;
}

export interface CreateEntrepreneurRequest {
  cnpj: string;
  companyName: string;
  description: string;
  email: string;
  phone: string;
  registrationDate: string;
  // Many-to-Many relationships
  businessAreas?: RelationshipDto[];
}

export interface UpdateEntrepreneurRequest {
  cnpj: string;
  companyName: string;
  description: string;
  email: string;
  phone: string;
  registrationDate: string;
  // Many-to-Many relationships
  businessAreas?: RelationshipDto[];
}
