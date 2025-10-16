import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Skill, CreateSkillRequest, UpdateSkillRequest } from '../../../shared/interface/skill.interface';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}/skills`;

  /**
   * Listar todos os skills
   */
  list(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  /**
   * Buscar skill por ID
   */
  getById(id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo skill
   */
  create(skill: CreateSkillRequest): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, skill);
  }

  /**
   * Atualizar skill existente
   */
  update(id: string, skill: UpdateSkillRequest): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiUrl}/${id}`, skill);
  }

  /**
   * Excluir skill
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar skills com filtros
   */
  search(filters: any): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
