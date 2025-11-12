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
import { MessageService } from 'primeng/api';

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
  private messageService = inject(MessageService);
  
  isLoggingIn = false;
  isForgotPasswordMode = false
  isCodeMode = false;
  loading = false;

  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  message = '';
  isMsalInitialized = false;
  
  // Informações do localStorage
  lastLoginInfo: any = null;
  hasValidSession = false;


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoggingIn = true;
    this.message = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
      },
      error: (err) => {
        this.message = 'E-mail ou senha inválidos. Tente novamente.';
        this.isLoggingIn = false;
      }
    });
  }

  resetAllForms(): void {
    this.loginForm.reset();
    this.forgotPasswordForm.reset();
    this.resetPasswordForm.reset();
  }

  toggleForgotPassword(): void {
    this.resetAllForms();
    if (!this.isForgotPasswordMode && !this.isCodeMode) {
      this.isForgotPasswordMode = true;
      this.isCodeMode = false;
    } 
    else {
      this.isForgotPasswordMode = false;
      this.isCodeMode = false;
    }
  }

  goToCodeMode(): void {
    this.resetAllForms();
    this.isForgotPasswordMode = false;
    this.isCodeMode = true;
  }

  cancelReset(): void {
    this.resetAllForms();
    this.isForgotPasswordMode = false;
    this.isCodeMode = false;
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    const email = this.forgotPasswordForm.value.email;

    this.authService.requestPasswordCode(email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Código enviado!',
          detail: 'Verifique seu e-mail e insira o código recebido.',
        });
        this.isForgotPasswordMode = false;
        this.isCodeMode = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível enviar o código. Verifique o e-mail informado.',
        });
      },
      complete: () => (this.loading = false),
    });
  }

  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    this.loading = true;
    const { code, newPassword } = this.resetPasswordForm.value;
    const email = this.forgotPasswordForm.value.email;

    this.authService.resetPassword(code, newPassword).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Senha redefinida!',
          detail: 'Você já pode fazer login com sua nova senha.',
        });
        this.cancelReset();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Código inválido!',
          detail: 'Verifique o código e tente novamente.',
        });
      },
      complete: () => (this.loading = false),
    });
  }


  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

}