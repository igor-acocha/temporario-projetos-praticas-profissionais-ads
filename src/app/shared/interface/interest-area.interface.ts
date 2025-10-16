import { Student } from './student.interface';

export interface InterestArea {
  id?: string;
  name: string;
  // Many-to-Many relationships
  students?: Student[];
}

export interface RelationshipDto {
  id: string;
}

export interface CreateInterestAreaRequest {
  name: string;
  // Many-to-Many relationships
  students?: RelationshipDto[];
}

export interface UpdateInterestAreaRequest {
  name: string;
  // Many-to-Many relationships
  students?: RelationshipDto[];
}
