import { Project } from './project.interface';

export interface Evaluation {
  id?: string;
  score: number;
  comment: string;
  evaluationDate?: string;
  project: Project;
  idEvaluator: string;
  idEvaluated: string;
  evaluatorType: string;
}

export interface RelationshipDto {
  id: string;
}

export interface CreateEvaluationRequest {
  score: number;
  comment: string;
  evaluationDate: string;
  project: RelationshipDto;
  idEvaluator: string;
  idEvaluated: string;
  evaluatorType: string;
}

export interface UpdateEvaluationRequest {
  score: number;
  comment: string;
  evaluationDate: string;
  project: RelationshipDto;
  idEvaluator: string;
  idEvaluated: string;
  evaluatorType: string;
}
