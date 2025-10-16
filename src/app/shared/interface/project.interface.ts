import { Entrepreneur } from './entrepreneur.interface';

export interface Project {
  id?: string;
  title: string;
  description: string;
  status: string;
  creationDate?: string;
  entrepreneur: Entrepreneur;
}

export interface RelationshipDto {
  id: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  status: string;
  creationDate: string;
  entrepreneur: RelationshipDto;
}

export interface UpdateProjectRequest {
  title: string;
  description: string;
  status: string;
  creationDate: string;
  entrepreneur: RelationshipDto;
}
