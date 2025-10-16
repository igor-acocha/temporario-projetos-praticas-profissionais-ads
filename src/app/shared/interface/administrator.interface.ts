
export interface Administrator {
  id?: string;
  name: string;
  email: string;
  password: string;
  creationDate?: string;
}

export interface RelationshipDto {
  id: string;
}

export interface CreateAdministratorRequest {
  name: string;
  email: string;
  password: string;
  creationDate: string;
}

export interface UpdateAdministratorRequest {
  name: string;
  email: string;
  password: string;
  creationDate: string;
}
