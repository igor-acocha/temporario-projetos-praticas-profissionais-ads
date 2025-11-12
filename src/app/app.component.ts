import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

// PrimeNG imports
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Components
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';

// Services
import { AuthService } from './core/services/auth.service';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    NavbarComponent,
    FooterComponent,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TIVIT Portal RPA';
  showNavigation = false;

  private readonly destroy$ = new Subject<void>();
  private router = inject(Router);
  private authService = inject(AuthService);
  private translationService = inject(TranslationService);

  ngOnInit(): void {
    // Atualiza visibilidade da navegação baseado na autenticação
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        this.updateNavigationVisibility(isAuthenticated);
      });

    // Reavalia visibilidade a cada mudança de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateNavigationVisibility(this.authService.getCurrentUser() !== null);
    });

    // Inicializa traduções do PrimeNG se necessário
    this.initializePrimeNGTranslations();
  }

  private updateNavigationVisibility(isAuthenticated: boolean): void {
    const currentUrl = this.router.url;
    const isAuthRoute = currentUrl.includes('/login') || currentUrl.includes('/register');
    this.showNavigation = isAuthenticated && !isAuthRoute;
  }

  isLoginPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/login' || currentUrl.startsWith('/login');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------
  // Traduções dinâmicas do PrimeNG
  // -------------------------
  private initializePrimeNGTranslations(): void {
    const currentLanguage = this.translationService.getCurrentLanguage();
    const primeNGTranslations = this.translationService.getPrimeNGTranslations(currentLanguage);
    
    // Para Angular 18+ com providePrimeNG, você pode atualizar traduções globalmente via provider
    // Caso precise dinamicamente, você precisaria de um serviço específico para setar traduções
    console.log(`PrimeNG translations initialized for language: ${currentLanguage}`, primeNGTranslations);
  }
}
