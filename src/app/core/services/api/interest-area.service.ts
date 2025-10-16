import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InterestArea, CreateInterestAreaRequest, UpdateInterestAreaRequest } from '../../../shared/interface/interest-area.interface';

@Injectable({
  providedIn: 'root'
})
export class InterestAreaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}/interest-areas`;

  /**
   * Listar todos os interestAreas
   */
  list(): Observable<InterestArea[]> {
    return this.http.get<InterestArea[]>(this.apiUrl);
  }

  /**
   * Buscar interestArea por ID
   */
  getById(id: string): Observable<InterestArea> {
    return this.http.get<InterestArea>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo interestArea
   */
  create(interestArea: CreateInterestAreaRequest): Observable<InterestArea> {
    return this.http.post<InterestArea>(this.apiUrl, interestArea);
  }

  /**
   * Atualizar interestArea existente
   */
  update(id: string, interestArea: UpdateInterestAreaRequest): Observable<InterestArea> {
    return this.http.put<InterestArea>(`${this.apiUrl}/${id}`, interestArea);
  }

  /**
   * Excluir interestArea
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar interestAreas com filtros
   */
  search(filters: any): Observable<InterestArea[]> {
    return this.http.get<InterestArea[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
