import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../../shared/interface/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/api/v1/projects`;

  /**
   * Listar todos os projects
   */
  list(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  /**
   * Buscar project por ID
   */
  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo project
   */
  create(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  /**
   * Atualizar project existente
   */
  update(id: string, project: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  /**
   * Excluir project
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar projects com filtros
   */
  search(filters: any): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
