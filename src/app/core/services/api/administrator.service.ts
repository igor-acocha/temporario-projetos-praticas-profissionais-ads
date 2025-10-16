import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Administrator, CreateAdministratorRequest, UpdateAdministratorRequest } from '../../../shared/interface/administrator.interface';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/api/v1/administrators`;

  /**
   * Listar todos os administrators
   */
  list(): Observable<Administrator[]> {
    return this.http.get<Administrator[]>(this.apiUrl);
  }

  /**
   * Buscar administrator por ID
   */
  getById(id: string): Observable<Administrator> {
    return this.http.get<Administrator>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo administrator
   */
  create(administrator: CreateAdministratorRequest): Observable<Administrator> {
    return this.http.post<Administrator>(this.apiUrl, administrator);
  }

  /**
   * Atualizar administrator existente
   */
  update(id: string, administrator: UpdateAdministratorRequest): Observable<Administrator> {
    return this.http.put<Administrator>(`${this.apiUrl}/${id}`, administrator);
  }

  /**
   * Excluir administrator
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar administrators com filtros
   */
  search(filters: any): Observable<Administrator[]> {
    return this.http.get<Administrator[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
