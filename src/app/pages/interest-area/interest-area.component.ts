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
import { InterestAreaService } from '../../core/services/api/interest-area.service';
import { StudentService } from '../../core/services/api/student.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { InterestArea, CreateInterestAreaRequest, UpdateInterestAreaRequest } from '../../shared/interface/interest-area.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-interest-area',
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
  templateUrl: './interest-area.component.html',
  styleUrl: './interest-area.component.scss',
  animations: [pageEnterAnimation]
})
export class InterestAreaComponent implements OnInit {
  private interestAreaService = inject(InterestAreaService);
  private studentService = inject(StudentService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  interestAreas: InterestArea[] = [];
  filteredInterestAreas: InterestArea[] = [];
  selectedInterestArea: InterestArea | null = null;
  loading = false;

  // Dropdown options
  studentOptions: any[] = [];

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
  interestAreaForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.interestAreaForm = this.fb.group({
      name: ['', [notBlankValidator(), Validators.maxLength(100)]],
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: [[]],
    });
    this.loadInterestArea();
    
    // Load all related entity options
    this.loadStudentOptions();
  }

  /**
   * Carregar lista de interestAreas
   */
  loadInterestArea(): void {
    this.interestAreas = [];
    this.filteredInterestAreas = [];
    this.loading = true;
    this.interestAreaService.list().subscribe({
      next: (interestAreas) => {
        this.interestAreas = interestAreas;
        this.filteredInterestAreas = [...interestAreas];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar interestAreas:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('interest-area.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo interestArea
   */
  newInterestArea(): void {
    this.interestAreaForm.reset({
      name: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: [],
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar interestArea
   */
  edit(interestArea: InterestArea): void {
    this.interestAreaForm.setValue({
      name: interestArea.name || '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: interestArea.students ? interestArea.students.map((item: any) => item.id) : [],
    });
    this.selectedInterestArea = interestArea;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar interestArea (criar ou atualizar)
   */
  save(): void {
    if (this.interestAreaForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.interestAreas = [];
    this.filteredInterestAreas = [];
    
    const formValue = this.interestAreaForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    
    
    // Transformar relacionamentos Many-to-Many em array de objetos com id (apenas o lado pai da relação)
    if (formValue.students && Array.isArray(formValue.students)) {
      formValue.students = formValue.students.map((id: string) => ({ id }));
    }
    if (this.isEditing && this.selectedInterestArea?.id) {
      // Atualizar interestArea existente
      this.interestAreaService.update(this.selectedInterestArea.id, formValue as UpdateInterestAreaRequest).subscribe({
        next: (interestArea) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('interest-area.default.successUpdate')
          });
          this.closeDialog();
          this.loadInterestArea();
        },
        error: (error) => {
          console.error('Erro ao atualizar interestArea:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('interest-area.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo interestArea
      this.interestAreaService.create(formValue as CreateInterestAreaRequest).subscribe({
        next: (interestArea) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('interest-area.default.successCreate')
          });
          this.closeDialog();
          this.loadInterestArea();
        },
        error: (error) => {
          console.error('Erro ao criar interestArea:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('interest-area.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de interestArea
   */
  confirmDelete(interestArea: InterestArea): void {
    const confirmMessage = this.translationService.translate('interest-area.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getInterestAreaDisplayText(interestArea)),
      header: this.translationService.translate('interest-area.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(interestArea);
      }
    });
  }

  /**
   * Excluir interestArea
   */
  private delete(interestArea: InterestArea): void {
    if (!interestArea.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.interestAreas = [];
    this.filteredInterestAreas = [];
    
    this.interestAreaService.delete(interestArea.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('interest-area.default.successDelete')
        });
        this.loadInterestArea();
      },
      error: (error) => {
        console.error('Erro ao excluir interestArea:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('interest-area.default.errorDelete')
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
    this.selectedInterestArea = null;
    this.interestAreaForm.reset({
      name: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: [],
    });
  }

  /**
   * Filtrar interestAreas com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInterestAreas = [...this.interestAreas];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredInterestAreas = this.interestAreas.filter(interestArea => 
      (interestArea.name?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredInterestAreas = [...this.interestAreas];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do interestArea
   */
  getInterestAreaDisplayText(interestArea: InterestArea): string {
    return interestArea.name || interestArea.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para Student
   */
  loadStudentOptions(): void {
    this.studentService.list().subscribe({
      next: (items) => {
        this.studentOptions = items.map((item: any) => ({
          id: item.id,
          name: item.name || item.id?.toString() // Sempre exibir o ID se não houver name
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar opções de student:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('student.errorLoadOptions')
        });
      }
    });
  }



}
