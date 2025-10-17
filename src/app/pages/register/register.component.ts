import { Component, OnInit, inject } from '@angular/core';
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
      cpfCnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      typeProfile: [null, Validators.required]
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso!', 
          detail: 'Cadastro realizado com sucesso. Você será redirecionado para o login.' 
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao cadastrar. Verifique se o e-mail ou CPF/CNPJ já estão em uso.';
        this.isSubmitting = false;
      }
    });
  }
}
