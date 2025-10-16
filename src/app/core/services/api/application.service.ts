import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Application, CreateApplicationRequest, UpdateApplicationRequest } from '../../../shared/interface/application.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/api/v1/applications`;

  /**
   * Listar todos os applications
   */
  list(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  /**
   * Buscar application por ID
   */
  getById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo application
   */
  create(application: CreateApplicationRequest): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  /**
   * Atualizar application existente
   */
  update(id: string, application: UpdateApplicationRequest): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}`, application);
  }

  /**
   * Excluir application
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar applications com filtros
   */
  search(filters: any): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
