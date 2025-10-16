import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrepreneur, CreateEntrepreneurRequest, UpdateEntrepreneurRequest } from '../../../shared/interface/entrepreneur.interface';

@Injectable({
  providedIn: 'root'
})
export class EntrepreneurService {
  private http = inject(HttpClient);
  private apiUrl = `http://localhost:8080/api/v1/entrepreneurs`;

  /**
   * Listar todos os entrepreneurs
   */
  list(): Observable<Entrepreneur[]> {
    return this.http.get<Entrepreneur[]>(this.apiUrl);
  }

  /**
   * Buscar entrepreneur por ID
   */
  getById(id: string): Observable<Entrepreneur> {
    return this.http.get<Entrepreneur>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo entrepreneur
   */
  create(entrepreneur: CreateEntrepreneurRequest): Observable<Entrepreneur> {
    return this.http.post<Entrepreneur>(this.apiUrl, entrepreneur);
  }

  /**
   * Atualizar entrepreneur existente
   */
  update(id: string, entrepreneur: UpdateEntrepreneurRequest): Observable<Entrepreneur> {
    return this.http.put<Entrepreneur>(`${this.apiUrl}/${id}`, entrepreneur);
  }

  /**
   * Excluir entrepreneur
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar entrepreneurs com filtros
   */
  search(filters: any): Observable<Entrepreneur[]> {
    return this.http.get<Entrepreneur[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
