import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * Guarda para proteger rotas que exigem autenticação.
 * Se o usuário não estiver autenticado, ele será redirecionado para /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true; // Usuário está logado, permite o acesso
      }
      
      // Usuário não está logado, redireciona para a página de login
      router.navigate(['/login']);
      return false;
    })
  );
};

/**
 * Guarda para impedir que usuários autenticados acessem páginas como /login e /register.
 * Se o usuário já estiver logado, ele será redirecionado para a /home.
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
            if (!isAuthenticated) {
                return true; // Não está logado, permite o acesso ao login/registro
            }

            // Já está logado, redireciona para a home
            router.navigate(['/home']);
            return false;
        })
    );
}
