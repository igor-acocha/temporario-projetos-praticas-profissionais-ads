import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

// Services
import { AdministratorService } from '../../core/services/api/administrator.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Administrator, CreateAdministratorRequest, UpdateAdministratorRequest } from '../../shared/interface/administrator.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    CardModule,
    TagModule,
    SkeletonModule,
    PaginatorModule,
    TranslatePipe,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    CheckboxModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.scss',
  animations: [pageEnterAnimation]
})
export class AdministratorComponent implements OnInit {
  private administratorService = inject(AdministratorService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  administrators: Administrator[] = [];
  filteredAdministrators: Administrator[] = [];
  selectedAdministrator: Administrator | null = null;
  loading = false;

  // Dropdown options

  // Pagination
  rowsPerPage = 10;

  // Search and filter
  searchTerm = '';
  sortField = '';
  sortOrder = 1;

  // Dialog states
  displayDialog = false;
  isEditing = false;

  // Form data
  administratorForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.administratorForm = this.fb.group({
      name: ['', [notBlankValidator(), Validators.maxLength(150)]],
      email: ['', [notBlankValidator(), Validators.maxLength(150)]],
      password: ['', [notBlankValidator(), Validators.maxLength(255)]],
      creationDate: ['', []],
    });
    this.loadAdministrator();
    
    // Load all related entity options
  }

  /**
   * Carregar lista de administrators
   */
  loadAdministrator(): void {
    this.administrators = [];
    this.filteredAdministrators = [];
    this.loading = true;
    this.administratorService.list().subscribe({
      next: (administrators) => {
        this.administrators = administrators;
        this.filteredAdministrators = [...administrators];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar administrators:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('administrator.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo administrator
   */
  newAdministrator(): void {
    this.administratorForm.reset({
      name: '',
      email: '',
      password: '',
      creationDate: '',
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar administrator
   */
  edit(administrator: Administrator): void {
    this.administratorForm.setValue({
      name: administrator.name || '',
      email: administrator.email || '',
      password: administrator.password || '',
      creationDate: administrator.creationDate || '',
    });
    this.selectedAdministrator = administrator;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar administrator (criar ou atualizar)
   */
  save(): void {
    if (this.administratorForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.administrators = [];
    this.filteredAdministrators = [];
    
    const formValue = this.administratorForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    
    
    if (this.isEditing && this.selectedAdministrator?.id) {
      // Atualizar administrator existente
      this.administratorService.update(this.selectedAdministrator.id, formValue as UpdateAdministratorRequest).subscribe({
        next: (administrator) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('administrator.default.successUpdate')
          });
          this.closeDialog();
          this.loadAdministrator();
        },
        error: (error) => {
          console.error('Erro ao atualizar administrator:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('administrator.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo administrator
      this.administratorService.create(formValue as CreateAdministratorRequest).subscribe({
        next: (administrator) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('administrator.default.successCreate')
          });
          this.closeDialog();
          this.loadAdministrator();
        },
        error: (error) => {
          console.error('Erro ao criar administrator:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('administrator.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de administrator
   */
  confirmDelete(administrator: Administrator): void {
    const confirmMessage = this.translationService.translate('administrator.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getAdministratorDisplayText(administrator)),
      header: this.translationService.translate('administrator.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(administrator);
      }
    });
  }

  /**
   * Excluir administrator
   */
  private delete(administrator: Administrator): void {
    if (!administrator.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.administrators = [];
    this.filteredAdministrators = [];
    
    this.administratorService.delete(administrator.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('administrator.default.successDelete')
        });
        this.loadAdministrator();
      },
      error: (error) => {
        console.error('Erro ao excluir administrator:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('administrator.default.errorDelete')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Fechar dialog
   */
  closeDialog(): void {
    this.displayDialog = false;
    this.selectedAdministrator = null;
    this.administratorForm.reset({
      name: '',
      email: '',
      password: '',
      creationDate: '',
    });
  }

  /**
   * Filtrar administrators com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAdministrators = [...this.administrators];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredAdministrators = this.administrators.filter(administrator => 
      (administrator.name?.toLowerCase().includes(searchTermLower)) ||
      (administrator.email?.toLowerCase().includes(searchTermLower)) ||
      (administrator.password?.toLowerCase().includes(searchTermLower)) ||
      (administrator.creationDate?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredAdministrators = [...this.administrators];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do administrator
   */
  getAdministratorDisplayText(administrator: Administrator): string {
    return administrator.name || administrator.id?.toString() || 'ID não disponível';
  }

}
