import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

// PrimeNG imports
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

// Services
import { SidebarService } from '../../core/services/sidebar.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';

// Components and pipes

export interface SidebarMenuItem {
  labelKey: string; // Changed to use translation key
  icon: string;
  route: string;
  badge?: string;
  badgeClass?: string;
  description?: string;
  requiresAuth?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
    BadgeModule,
    TranslatePipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  sidebarVisible = false; // Inicialmente colapsada no desktop
  hoverExpanded = false; // Nova propriedade para hover
  isMobile = false;
  isLoggedIn = false;
  displayName = '';
  
  private readonly destroy$ = new Subject<void>();
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);

  menuItems: SidebarMenuItem[] = [
    {
      labelKey: 'nav.home',
      icon: 'pi pi-home',
      route: '/home',
      requiresAuth: true
    },
    {
      labelKey: 'nav.administrator',
      icon: 'pi pi-list',
      route: '/administrator',
      requiresAuth: true
    },
    {
      labelKey: 'nav.application',
      icon: 'pi pi-list',
      route: '/application',
      requiresAuth: true
    },
    {
      labelKey: 'nav.businessArea',
      icon: 'pi pi-list',
      route: '/business-area',
      requiresAuth: true
    },
    {
      labelKey: 'nav.entrepreneur',
      icon: 'pi pi-list',
      route: '/entrepreneur',
      requiresAuth: true
    },
    {
      labelKey: 'nav.evaluation',
      icon: 'pi pi-list',
      route: '/evaluation',
      requiresAuth: true
    },
    {
      labelKey: 'nav.interestArea',
      icon: 'pi pi-list',
      route: '/interest-area',
      requiresAuth: true
    },
    {
      labelKey: 'nav.project',
      icon: 'pi pi-list',
      route: '/project',
      requiresAuth: true
    },
    {
      labelKey: 'nav.skill',
      icon: 'pi pi-list',
      route: '/skill',
      requiresAuth: true
    },
    {
      labelKey: 'nav.student',
      icon: 'pi pi-list',
      route: '/student',
      requiresAuth: true
    }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
    this.setupResizeListener();
    this.setupSidebarStateListener();
    this.setupSidebarStateListener();
    this.setupAuthListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarVisible = false;
      this.hoverExpanded = false;
    } else {
      // No desktop, sidebar sempre colapsada por padrão
      this.sidebarVisible = false;
    }
    
    // Atualizar o serviço com o estado atual
    this.sidebarService.updateSidebarState({
      visible: this.sidebarVisible,
      hoverExpanded: this.hoverExpanded,
      isMobile: this.isMobile
    });
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    // Se mudou de mobile para desktop, manter sidebar colapsada
    if (wasMobile && !this.isMobile) {
      this.sidebarVisible = false;
      this.hoverExpanded = false;
    }
    // Se mudou de desktop para mobile, recolher sidebar e hover
    else if (!wasMobile && this.isMobile) {
      this.sidebarVisible = false;
      this.hoverExpanded = false;
    }
  }

  onMouseEnter(): void {
    if (!this.isMobile && !this.sidebarVisible) {
      this.hoverExpanded = true;
      this.sidebarService.updateSidebarState({ 
        hoverExpanded: true 
      });
    }
  }

  onMouseLeave(): void {
    if (!this.isMobile) {
      this.hoverExpanded = false;
      this.sidebarService.updateSidebarState({ 
        hoverExpanded: false 
      });
    }
  }

  private setupSidebarStateListener(): void {
    // Escutar mudanças no estado da sidebar vindas do SidebarService
    this.sidebarService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.sidebarVisible = state.visible;
        this.hoverExpanded = state.hoverExpanded;
        this.isMobile = state.isMobile;
      });
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

  onMenuClick(item: SidebarMenuItem): void {
    // Verificar se requer autenticação
    if (item.requiresAuth && !this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Fechar sidebar no mobile após clique
    if (this.isMobile) {
      this.sidebarVisible = false;
    }

    // Navegar para a rota
    this.router.navigate([item.route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  private setupAuthListener(): void {
    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isLoggedIn = isAuth;
        if (isAuth) {
          this.displayName = this.authService.getUserDisplayName();
        } else {
          this.displayName = '';
      }
    });
  }
}
