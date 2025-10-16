import { InterestArea } from './interest-area.interface';
import { Skill } from './skill.interface';

export interface Student {
  id?: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  registrationDate?: string;
  // Many-to-Many relationships
  interestAreas?: InterestArea[];
  skills?: Skill[];
}

export interface RelationshipDto {
  id: string;
}

export interface CreateStudentRequest {
  name: string;
  phone: string;
  email: string;
  description: string;
  registrationDate: string;
  // Many-to-Many relationships
  interestAreas?: RelationshipDto[];
  skills?: RelationshipDto[];
}

export interface UpdateStudentRequest {
  name: string;
  phone: string;
  email: string;
  description: string;
  registrationDate: string;
  // Many-to-Many relationships
  interestAreas?: RelationshipDto[];
  skills?: RelationshipDto[];
}
