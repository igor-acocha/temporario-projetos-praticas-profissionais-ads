import { Usuario } from './usuario.interface';

export interface Curso {
  id?: string;
  iniciado?: boolean;
  nivelInicial?: number;
  nivelAtual?: number;
  unidadeAtual?: number;
  unidadesFeitas?: number;
  usuario?: Usuario;
}

export interface RelationshipDto {
  id: string;
}

export interface CreateCursoRequest {
  iniciado?: boolean;
  nivelInicial?: number;
  nivelAtual?: number;
  unidadeAtual?: number;
  unidadesFeitas?: number;
  usuario?: RelationshipDto;
}

export interface UpdateCursoRequest {
  iniciado?: boolean;
  nivelInicial?: number;
  nivelAtual?: number;
  unidadeAtual?: number;
  unidadesFeitas?: number;
  usuario?: RelationshipDto;
}
