import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BusinessArea, CreateBusinessAreaRequest, UpdateBusinessAreaRequest } from '../../../shared/interface/business-area.interface';

@Injectable({
  providedIn: 'root'
})
export class BusinessAreaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}/business-areas`;

  /**
   * Listar todos os businessAreas
   */
  list(): Observable<BusinessArea[]> {
    return this.http.get<BusinessArea[]>(this.apiUrl);
  }

  /**
   * Buscar businessArea por ID
   */
  getById(id: string): Observable<BusinessArea> {
    return this.http.get<BusinessArea>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo businessArea
   */
  create(businessArea: CreateBusinessAreaRequest): Observable<BusinessArea> {
    return this.http.post<BusinessArea>(this.apiUrl, businessArea);
  }

  /**
   * Atualizar businessArea existente
   */
  update(id: string, businessArea: UpdateBusinessAreaRequest): Observable<BusinessArea> {
    return this.http.put<BusinessArea>(`${this.apiUrl}/${id}`, businessArea);
  }

  /**
   * Excluir businessArea
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar businessAreas com filtros
   */
  search(filters: any): Observable<BusinessArea[]> {
    return this.http.get<BusinessArea[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
