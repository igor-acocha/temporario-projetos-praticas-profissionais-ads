import { Entrepreneur } from './entrepreneur.interface';

export interface BusinessArea {
  id?: string;
  name: string;
  // Many-to-Many relationships
  entrepreneurs?: Entrepreneur[];
}

export interface RelationshipDto {
  id: string;
}

export interface CreateBusinessAreaRequest {
  name: string;
  // Many-to-Many relationships
  entrepreneurs?: RelationshipDto[];
}

export interface UpdateBusinessAreaRequest {
  name: string;
  // Many-to-Many relationships
  entrepreneurs?: RelationshipDto[];
}
