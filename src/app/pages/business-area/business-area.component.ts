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
import { BusinessAreaService } from '../../core/services/api/business-area.service';
import { EntrepreneurService } from '../../core/services/api/entrepreneur.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { BusinessArea, CreateBusinessAreaRequest, UpdateBusinessAreaRequest } from '../../shared/interface/business-area.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-business-area',
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
  templateUrl: './business-area.component.html',
  styleUrl: './business-area.component.scss',
  animations: [pageEnterAnimation]
})
export class BusinessAreaComponent implements OnInit {
  private businessAreaService = inject(BusinessAreaService);
  private entrepreneurService = inject(EntrepreneurService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  businessAreas: BusinessArea[] = [];
  filteredBusinessAreas: BusinessArea[] = [];
  selectedBusinessArea: BusinessArea | null = null;
  loading = false;

  // Dropdown options
  entrepreneurOptions: any[] = [];

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
  businessAreaForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.businessAreaForm = this.fb.group({
      name: ['', [notBlankValidator(), Validators.maxLength(100)]],
      // Many-to-Many relationships (apenas o lado pai da relação)
      entrepreneurs: [[]],
    });
    this.loadBusinessArea();
    
    // Load all related entity options
    this.loadEntrepreneurOptions();
  }

  /**
   * Carregar lista de businessAreas
   */
  loadBusinessArea(): void {
    this.businessAreas = [];
    this.filteredBusinessAreas = [];
    this.loading = true;
    this.businessAreaService.list().subscribe({
      next: (businessAreas) => {
        this.businessAreas = businessAreas;
        this.filteredBusinessAreas = [...businessAreas];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar businessAreas:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('business-area.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo businessArea
   */
  newBusinessArea(): void {
    this.businessAreaForm.reset({
      name: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      entrepreneurs: [],
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar businessArea
   */
  edit(businessArea: BusinessArea): void {
    this.businessAreaForm.setValue({
      name: businessArea.name || '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      entrepreneurs: businessArea.entrepreneurs ? businessArea.entrepreneurs.map((item: any) => item.id) : [],
    });
    this.selectedBusinessArea = businessArea;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar businessArea (criar ou atualizar)
   */
  save(): void {
    if (this.businessAreaForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.businessAreas = [];
    this.filteredBusinessAreas = [];
    
    const formValue = this.businessAreaForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    
    
    // Transformar relacionamentos Many-to-Many em array de objetos com id (apenas o lado pai da relação)
    if (formValue.entrepreneurs && Array.isArray(formValue.entrepreneurs)) {
      formValue.entrepreneurs = formValue.entrepreneurs.map((id: string) => ({ id }));
    }
    if (this.isEditing && this.selectedBusinessArea?.id) {
      // Atualizar businessArea existente
      this.businessAreaService.update(this.selectedBusinessArea.id, formValue as UpdateBusinessAreaRequest).subscribe({
        next: (businessArea) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('business-area.default.successUpdate')
          });
          this.closeDialog();
          this.loadBusinessArea();
        },
        error: (error) => {
          console.error('Erro ao atualizar businessArea:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('business-area.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo businessArea
      this.businessAreaService.create(formValue as CreateBusinessAreaRequest).subscribe({
        next: (businessArea) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('business-area.default.successCreate')
          });
          this.closeDialog();
          this.loadBusinessArea();
        },
        error: (error) => {
          console.error('Erro ao criar businessArea:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('business-area.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de businessArea
   */
  confirmDelete(businessArea: BusinessArea): void {
    const confirmMessage = this.translationService.translate('business-area.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getBusinessAreaDisplayText(businessArea)),
      header: this.translationService.translate('business-area.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(businessArea);
      }
    });
  }

  /**
   * Excluir businessArea
   */
  private delete(businessArea: BusinessArea): void {
    if (!businessArea.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.businessAreas = [];
    this.filteredBusinessAreas = [];
    
    this.businessAreaService.delete(businessArea.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('business-area.default.successDelete')
        });
        this.loadBusinessArea();
      },
      error: (error) => {
        console.error('Erro ao excluir businessArea:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('business-area.default.errorDelete')
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
    this.selectedBusinessArea = null;
    this.businessAreaForm.reset({
      name: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      entrepreneurs: [],
    });
  }

  /**
   * Filtrar businessAreas com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBusinessAreas = [...this.businessAreas];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredBusinessAreas = this.businessAreas.filter(businessArea => 
      (businessArea.name?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredBusinessAreas = [...this.businessAreas];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do businessArea
   */
  getBusinessAreaDisplayText(businessArea: BusinessArea): string {
    return businessArea.name || businessArea.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para Entrepreneur
   */
  loadEntrepreneurOptions(): void {
    this.entrepreneurService.list().subscribe({
      next: (items) => {
        this.entrepreneurOptions = items.map((item: any) => ({
          id: item.id,
          name: item.name || item.id?.toString() // Sempre exibir o ID se não houver name
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar opções de entrepreneur:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('entrepreneur.errorLoadOptions')
        });
      }
    });
  }



}
