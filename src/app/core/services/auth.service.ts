import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


// Interfaces para tipagem
interface TokenResponse {
  token: string;
}

interface UserPayload {
  sub: string; // email
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.api.url}/users`;
  private passwordApiUrl = `${environment.api.url}/password`;


  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<UserPayload | null>(this.getUserFromToken());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getUserFromToken(): UserPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { sub: payload.sub, role: payload.role };
    } catch (e) {
      console.error('Token JWT inválido.', e);
      this.logout();
      return null;
    }
  }

  // MÉTODO ADICIONADO PARA CORRIGIR O ERRO
  /**
   * Retorna o valor síncrono do usuário atual.
   * Útil para verificações imediatas onde um Observable não é necessário.
   */
  public getCurrentUser(): UserPayload | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(this.getUserFromToken());
        this.router.navigate(['/home']);
      }),
      catchError(this.handleError)
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserDisplayName(): string {
    return this.getCurrentUser()?.sub || 'Usuário';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || 'Ocorreu um erro desconhecido.';
    return throwError(() => new Error(errorMessage));
  }

  
 requestPasswordCode(email: string): Observable<any> {
    return this.http.post(`${this.passwordApiUrl}/request-code`, { email }).pipe(
      catchError(this.handleError)
    );
  }


  resetPassword(code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.passwordApiUrl}/reset`, { code, newPassword }).pipe(
      catchError(this.handleError)
    );
  }

}

