import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// MSAL imports

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../core/services/auth.service';

// Animations
import { pageEnterAnimation } from '../../shared/animations';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [pageEnterAnimation]
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  isLoggingIn = false;
  errorMessage = '';
  isMsalInitialized = false;
  
  // Informações do localStorage
  lastLoginInfo: any = null;
  hasValidSession = false;

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoggingIn = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        // A navegação é feita pelo AuthService
      },
      error: (err) => {
        this.errorMessage = 'E-mail ou senha inválidos. Tente novamente.';
        this.isLoggingIn = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}