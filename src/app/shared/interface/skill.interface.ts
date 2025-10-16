import { Student } from './student.interface';

export interface Skill {
  id?: string;
  name: string;
  // Many-to-Many relationships
  students?: Student[];
}

export interface RelationshipDto {
  id: string;
}

export interface CreateSkillRequest {
  name: string;
  // Many-to-Many relationships
  students?: RelationshipDto[];
}

export interface UpdateSkillRequest {
  name: string;
  // Many-to-Many relationships
  students?: RelationshipDto[];
}
