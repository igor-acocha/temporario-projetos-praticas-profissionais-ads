import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { pageEnterAnimation } from '../../shared/animations';
import { cpfCnpjValidator } from '../../shared/validators/cpf-cnpj-validator';
import { passwordStrengthValidator } from '../../shared/validators/password-strength.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [pageEnterAnimation]
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  profileTypes = [
    { label: 'Estudante', value: 'STUDENT' },
    { label: 'Empreendedor', value: 'ENTREPRENEUR' }
  ];

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      cpfCnpj: ['', [Validators.required, cpfCnpjValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator]],
      typeProfile: [null, Validators.required]
    });
  }

  onNumericInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    this.registerForm.get('cpfCnpj')?.setValue(input.value, { emitEvent: false });
  }


  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

     const formData = {
      ...this.registerForm.value,
      cpfCnpj: this.registerForm.value.cpfCnpj.replace(/\D/g, '') // remove máscara
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Cadastro realizado com sucesso. Você será redirecionado para o login.',
          life: 4000
        });

        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isSubmitting = false;

        const status = err?.status || err?.error?.status || null;

        const backendMessage =
          err?.error?.message ||
          err?.message ||
          'Ocorreu um erro inesperado.';

        const isConflict =
          status === 409 ||
          backendMessage?.toLowerCase().includes('já está em uso') ||
          backendMessage?.toLowerCase().includes('em uso');

        const severity = isConflict ? 'warn' : 'error';
        const summary = isConflict ? 'Dados já cadastrados' : 'Erro ao cadastrar';
        const detail = isConflict
          ? 'E-mail ou CPF/CNPJ já estão em uso. Verifique e tente novamente.'
          : 'Ocorreu um erro ao cadastrar. Tente novamente mais tarde.';

        this.messageService.add({
          severity,
          summary,
          detail,
          life: 5000
        });
      }
    });
  }
}
