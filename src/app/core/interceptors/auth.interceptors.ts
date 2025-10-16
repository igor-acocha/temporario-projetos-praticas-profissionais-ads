import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>, 
    next: HttpHandlerFn
    ): Observable<HttpEvent<any>> => {
        
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        // Clona a requisição e adiciona o cabeçalho de autorização
        const clonedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(clonedReq);
    }

    return next(req);
};
