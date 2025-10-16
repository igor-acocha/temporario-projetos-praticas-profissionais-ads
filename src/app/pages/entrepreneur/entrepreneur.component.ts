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
import { EntrepreneurService } from '../../core/services/api/entrepreneur.service';
import { BusinessAreaService } from '../../core/services/api/business-area.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Entrepreneur, CreateEntrepreneurRequest, UpdateEntrepreneurRequest } from '../../shared/interface/entrepreneur.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-entrepreneur',
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
  templateUrl: './entrepreneur.component.html',
  styleUrl: './entrepreneur.component.scss',
  animations: [pageEnterAnimation]
})
export class EntrepreneurComponent implements OnInit {
  private entrepreneurService = inject(EntrepreneurService);
  private businessAreaService = inject(BusinessAreaService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  entrepreneurs: Entrepreneur[] = [];
  filteredEntrepreneurs: Entrepreneur[] = [];
  selectedEntrepreneur: Entrepreneur | null = null;
  loading = false;

  // Dropdown options
  businessAreaOptions: any[] = [];

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
  entrepreneurForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.entrepreneurForm = this.fb.group({
      cnpj: ['', [Validators.maxLength(20)]],
      companyName: ['', [notBlankValidator(), Validators.maxLength(255)]],
      description: ['', [notBlankValidator()]],
      email: ['', [notBlankValidator(), Validators.maxLength(150)]],
      phone: ['', [notBlankValidator(), Validators.maxLength(50)]],
      registrationDate: ['', []],
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
    this.loadEntrepreneur();
    
    // Load all related entity options
    this.loadBusinessAreaOptions();
  }

  /**
   * Carregar lista de entrepreneurs
   */
  loadEntrepreneur(): void {
    this.entrepreneurs = [];
    this.filteredEntrepreneurs = [];
    this.loading = true;
    this.entrepreneurService.list().subscribe({
      next: (entrepreneurs) => {
        this.entrepreneurs = entrepreneurs;
        this.filteredEntrepreneurs = [...entrepreneurs];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar entrepreneurs:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('entrepreneur.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo entrepreneur
   */
  newEntrepreneur(): void {
    this.entrepreneurForm.reset({
      cnpj: '',
      companyName: '',
      description: '',
      email: '',
      phone: '',
      registrationDate: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar entrepreneur
   */
  edit(entrepreneur: Entrepreneur): void {
    this.entrepreneurForm.setValue({
      cnpj: entrepreneur.cnpj || '',
      companyName: entrepreneur.companyName || '',
      description: entrepreneur.description || '',
      email: entrepreneur.email || '',
      phone: entrepreneur.phone || '',
      registrationDate: entrepreneur.registrationDate || '',
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
    this.selectedEntrepreneur = entrepreneur;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar entrepreneur (criar ou atualizar)
   */
  save(): void {
    if (this.entrepreneurForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.entrepreneurs = [];
    this.filteredEntrepreneurs = [];
    
    const formValue = this.entrepreneurForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    
    
    // Transformar relacionamentos Many-to-Many em array de objetos com id (apenas o lado pai da relação)
    if (this.isEditing && this.selectedEntrepreneur?.id) {
      // Atualizar entrepreneur existente
      this.entrepreneurService.update(this.selectedEntrepreneur.id, formValue as UpdateEntrepreneurRequest).subscribe({
        next: (entrepreneur) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('entrepreneur.default.successUpdate')
          });
          this.closeDialog();
          this.loadEntrepreneur();
        },
        error: (error) => {
          console.error('Erro ao atualizar entrepreneur:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('entrepreneur.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo entrepreneur
      this.entrepreneurService.create(formValue as CreateEntrepreneurRequest).subscribe({
        next: (entrepreneur) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('entrepreneur.default.successCreate')
          });
          this.closeDialog();
          this.loadEntrepreneur();
        },
        error: (error) => {
          console.error('Erro ao criar entrepreneur:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('entrepreneur.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de entrepreneur
   */
  confirmDelete(entrepreneur: Entrepreneur): void {
    const confirmMessage = this.translationService.translate('entrepreneur.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getEntrepreneurDisplayText(entrepreneur)),
      header: this.translationService.translate('entrepreneur.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(entrepreneur);
      }
    });
  }

  /**
   * Excluir entrepreneur
   */
  private delete(entrepreneur: Entrepreneur): void {
    if (!entrepreneur.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.entrepreneurs = [];
    this.filteredEntrepreneurs = [];
    
    this.entrepreneurService.delete(entrepreneur.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('entrepreneur.default.successDelete')
        });
        this.loadEntrepreneur();
      },
      error: (error) => {
        console.error('Erro ao excluir entrepreneur:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('entrepreneur.default.errorDelete')
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
    this.selectedEntrepreneur = null;
    this.entrepreneurForm.reset({
      cnpj: '',
      companyName: '',
      description: '',
      email: '',
      phone: '',
      registrationDate: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
  }

  /**
   * Filtrar entrepreneurs com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEntrepreneurs = [...this.entrepreneurs];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredEntrepreneurs = this.entrepreneurs.filter(entrepreneur => 
      (entrepreneur.cnpj?.toLowerCase().includes(searchTermLower)) ||
      (entrepreneur.companyName?.toLowerCase().includes(searchTermLower)) ||
      (entrepreneur.description?.toLowerCase().includes(searchTermLower)) ||
      (entrepreneur.email?.toLowerCase().includes(searchTermLower)) ||
      (entrepreneur.phone?.toLowerCase().includes(searchTermLower)) ||
      (entrepreneur.registrationDate?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEntrepreneurs = [...this.entrepreneurs];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do entrepreneur
   */
  getEntrepreneurDisplayText(entrepreneur: Entrepreneur): string {
    return entrepreneur.cnpj || entrepreneur.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para BusinessArea
   */
  loadBusinessAreaOptions(): void {
    this.businessAreaService.list().subscribe({
      next: (items) => {
        this.businessAreaOptions = items.map((item: any) => ({
          id: item.id,
          name: item.name || item.id?.toString() // Sempre exibir o ID se não houver name
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar opções de businessArea:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('business-area.errorLoadOptions')
        });
      }
    });
  }



}
