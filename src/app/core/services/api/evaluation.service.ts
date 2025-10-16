import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Evaluation, CreateEvaluationRequest, UpdateEvaluationRequest } from '../../../shared/interface/evaluation.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}/evaluations`;

  /**
   * Listar todos os evaluations
   */
  list(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  /**
   * Buscar evaluation por ID
   */
  getById(id: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo evaluation
   */
  create(evaluation: CreateEvaluationRequest): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  /**
   * Atualizar evaluation existente
   */
  update(id: string, evaluation: UpdateEvaluationRequest): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, evaluation);
  }

  /**
   * Excluir evaluation
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar evaluations com filtros
   */
  search(filters: any): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
