import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Student, CreateStudentRequest, UpdateStudentRequest } from '../../../shared/interface/student.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}/students`;

  /**
   * Listar todos os students
   */
  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  /**
   * Buscar student por ID
   */
  getById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar novo student
   */
  create(student: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  /**
   * Atualizar student existente
   */
  update(id: string, student: UpdateStudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  /**
   * Excluir student
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar students com filtros
   */
  search(filters: any): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/search`, { params: filters });
  }
}
