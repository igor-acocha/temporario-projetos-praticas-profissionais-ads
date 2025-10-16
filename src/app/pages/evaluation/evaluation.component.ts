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
import { EvaluationService } from '../../core/services/api/evaluation.service';
import { ProjectService } from '../../core/services/api/project.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Evaluation, CreateEvaluationRequest, UpdateEvaluationRequest } from '../../shared/interface/evaluation.interface';
import { Project } from '../../shared/interface/project.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-evaluation',
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
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss',
  animations: [pageEnterAnimation]
})
export class EvaluationComponent implements OnInit {
  private evaluationService = inject(EvaluationService);
  private projectService = inject(ProjectService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  selectedEvaluation: Evaluation | null = null;
  loading = false;

  // Dropdown options
  fkProjectOptions: any[] = [];

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
  evaluationForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.evaluationForm = this.fb.group({
      score: ['', notBlankValidator()],
      comment: ['', [notBlankValidator()]],
      evaluationDate: ['', []],
      project: ['', [notBlankValidator(), Validators.maxLength(36)]],
      idEvaluator: ['', [notBlankValidator(), Validators.maxLength(36)]],
      idEvaluated: ['', [notBlankValidator(), Validators.maxLength(36)]],
      evaluatorType: ['', [notBlankValidator()]],
    });
    this.loadEvaluation();
    
    // Load all related entity options
    this.loadProjectOptions();
  }

  /**
   * Carregar lista de evaluations
   */
  loadEvaluation(): void {
    this.evaluations = [];
    this.filteredEvaluations = [];
    this.loading = true;
    this.evaluationService.list().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations;
        this.filteredEvaluations = [...evaluations];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar evaluations:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('evaluation.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo evaluation
   */
  newEvaluation(): void {
    this.evaluationForm.reset({
      score: '',
      comment: '',
      evaluationDate: '',
      project: '',
      idEvaluator: '',
      idEvaluated: '',
      evaluatorType: '',
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar evaluation
   */
  edit(evaluation: Evaluation): void {
    this.evaluationForm.setValue({
      score: evaluation.score || '',
      comment: evaluation.comment || '',
      evaluationDate: evaluation.evaluationDate || '',
      project: evaluation.project?.id || '',
      idEvaluator: evaluation.idEvaluator || '',
      idEvaluated: evaluation.idEvaluated || '',
      evaluatorType: evaluation.evaluatorType || '',
    });
    this.selectedEvaluation = evaluation;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar evaluation (criar ou atualizar)
   */
  save(): void {
    if (this.evaluationForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.evaluations = [];
    this.filteredEvaluations = [];
    
    const formValue = this.evaluationForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    // FK Simples - envolver em objeto { id: "..." }
    if (formValue.project) {
      formValue.project = { id: formValue.project };
    }
    
    
    if (this.isEditing && this.selectedEvaluation?.id) {
      // Atualizar evaluation existente
      this.evaluationService.update(this.selectedEvaluation.id, formValue as UpdateEvaluationRequest).subscribe({
        next: (evaluation) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('evaluation.default.successUpdate')
          });
          this.closeDialog();
          this.loadEvaluation();
        },
        error: (error) => {
          console.error('Erro ao atualizar evaluation:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('evaluation.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo evaluation
      this.evaluationService.create(formValue as CreateEvaluationRequest).subscribe({
        next: (evaluation) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('evaluation.default.successCreate')
          });
          this.closeDialog();
          this.loadEvaluation();
        },
        error: (error) => {
          console.error('Erro ao criar evaluation:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('evaluation.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de evaluation
   */
  confirmDelete(evaluation: Evaluation): void {
    const confirmMessage = this.translationService.translate('evaluation.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getEvaluationDisplayText(evaluation)),
      header: this.translationService.translate('evaluation.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(evaluation);
      }
    });
  }

  /**
   * Excluir evaluation
   */
  private delete(evaluation: Evaluation): void {
    if (!evaluation.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.evaluations = [];
    this.filteredEvaluations = [];
    
    this.evaluationService.delete(evaluation.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('evaluation.default.successDelete')
        });
        this.loadEvaluation();
      },
      error: (error) => {
        console.error('Erro ao excluir evaluation:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('evaluation.default.errorDelete')
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
    this.selectedEvaluation = null;
    this.evaluationForm.reset({
      score: '',
      comment: '',
      evaluationDate: '',
      project: '',
      idEvaluator: '',
      idEvaluated: '',
      evaluatorType: '',
    });
  }

  /**
   * Filtrar evaluations com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvaluations = [...this.evaluations];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredEvaluations = this.evaluations.filter(evaluation => 
      (evaluation.comment?.toLowerCase().includes(searchTermLower)) ||
      (evaluation.evaluationDate?.toLowerCase().includes(searchTermLower)) ||
      (evaluation.idEvaluator?.toLowerCase().includes(searchTermLower)) ||
      (evaluation.idEvaluated?.toLowerCase().includes(searchTermLower)) ||
      (evaluation.evaluatorType?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEvaluations = [...this.evaluations];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do evaluation
   */
  getEvaluationDisplayText(evaluation: Evaluation): string {
    return evaluation.comment || evaluation.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para Project
   */
  loadProjectOptions(): void {
    this.projectService.list().subscribe({
      next: (items) => {
        this.fkProjectOptions = items.map((item: any) => ({
          label: item.name || item.id?.toString(), // Sempre exibir o ID se não houver name
          value: item.id
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar opções de project:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('project.errorLoadOptions')
        });
      }
    });
  }



}
