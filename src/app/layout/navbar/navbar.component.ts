import { Component, OnInit, OnDestroy, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

// PrimeNG
import { ButtonModule } from "primeng/button";
import { AvatarModule } from "primeng/avatar";
import { TooltipModule } from "primeng/tooltip";
import { MenuModule } from "primeng/menu";
import { Menu } from "primeng/menu";

// Services
import { SidebarService } from "../../core/services/sidebar.service";
import { AuthService } from "../../core/services/auth.service";
import { TranslationService } from "../../core/services/translation.service";
import { ThemeService } from "../../core/services/theme.service";

// Components and Pipes
import { TranslatePipe } from "../../shared/pipes/translate.pipe";
import { LanguageSelectorComponent } from "../../shared/components/language-selector/language-selector.component";
import { ThemeToggleComponent } from "../../shared/components/theme-toggle/theme-toggle.component";


@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
    MenuModule,
    TranslatePipe,
    LanguageSelectorComponent, // Adicionado para corrigir erro
    ThemeToggleComponent       // Adicionado para corrigir erro
  ],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild("userMenu") userMenu!: Menu;

  isLoggedIn = false;
  displayName = "";
  userInitials = "";
  
  // Propriedades adicionadas para corrigir os erros
  isMenuOpen = false;
  isLanguageSubmenuOpen = false;
  languageFlags: { [key: string]: string } = {
    pt: "assets/images/flags/br.svg",
    en: "assets/images/flags/us.svg",
    es: "assets/images/flags/es.svg",
  };

  private readonly destroy$ = new Subject<void>();
  private router = inject(Router);
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  public themeService = inject(ThemeService); // Tornando público para o template
  private translationService = inject(TranslationService);


  ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isLoggedIn = isAuth;
        this.setLoginDisplay();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    const currentState = this.sidebarService.getSidebarState();
    this.sidebarService.updateSidebarState({ visible: !currentState.visible });
  }

  private setLoginDisplay(): void {
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.displayName = user?.sub || "Usuário";

      const nameParts = this.displayName.split(/[.@]/);
      this.userInitials = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();

    } else {
      this.displayName = "";
      this.userInitials = "";
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }  
  
  // Métodos adicionados para corrigir os erros
  login(): void {
    this.router.navigate(['/login']);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    this.isLanguageSubmenuOpen = false;
  }
  
  toggleLanguageSubmenu(): void {
    this.isLanguageSubmenuOpen = !this.isLanguageSubmenuOpen;
  }

  changeLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
    this.closeMenu();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
    this.closeMenu();
  }

  private closeMenu(): void {
    this.isMenuOpen = false;
    this.isLanguageSubmenuOpen = false;
  }
}

