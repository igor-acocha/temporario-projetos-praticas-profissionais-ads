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
import { ApplicationService } from '../../core/services/api/application.service';
import { StudentService } from '../../core/services/api/student.service';
import { ProjectService } from '../../core/services/api/project.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Application, CreateApplicationRequest, UpdateApplicationRequest } from '../../shared/interface/application.interface';
import { Student } from '../../shared/interface/student.interface';
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
  selector: 'app-application',
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
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',
  animations: [pageEnterAnimation]
})
export class ApplicationComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private studentService = inject(StudentService);
  private projectService = inject(ProjectService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  selectedApplication: Application | null = null;
  loading = false;

  // Dropdown options
  fkStudentOptions: any[] = [];
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
  applicationForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela de junção complexa
    this.applicationForm = this.fb.group({
      student: ['', Validators.required],
      project: ['', Validators.required],
      idea: ['', []],
      status: ['', [notBlankValidator()]],
      applicationDate: ['', []],
    });
    this.loadApplication();
    
    // Load all related entity options
    this.loadStudentOptions();
    this.loadProjectOptions();
  }

  /**
   * Carregar lista de applications
   */
  loadApplication(): void {
    this.applications = [];
    this.filteredApplications = [];
    this.loading = true;
    this.applicationService.list().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filteredApplications = [...applications];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar applications:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('application.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo application
   */
  newApplication(): void {
    this.applicationForm.reset({
      idea: '',
      status: '',
      applicationDate: '',
      student: '',
      project: '',
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar application
   */
  edit(application: Application): void {
    this.applicationForm.setValue({
      idea: application.idea || '',
      status: application.status || '',
      applicationDate: application.applicationDate || '',
      student: application.student?.id || '',
      project: application.project?.id || '',
    });
    this.selectedApplication = application;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar application (criar ou atualizar)
   */
  save(): void {
    if (this.applicationForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.applications = [];
    this.filteredApplications = [];
    
    const formValue = this.applicationForm.value;
    
    // Transformar campos FK da tabela de junção complexa em objetos com id
    if (formValue.student) {
      formValue.student = formValue.student;
    }
    if (formValue.project) {
      formValue.project = formValue.project;
    }
    if (this.isEditing && this.selectedApplication?.id) {
      // Atualizar application existente
      this.applicationService.update(this.selectedApplication.id, formValue as UpdateApplicationRequest).subscribe({
        next: (application) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('application.default.successUpdate')
          });
          this.closeDialog();
          this.loadApplication();
        },
        error: (error) => {
          console.error('Erro ao atualizar application:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('application.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo application
      this.applicationService.create(formValue as CreateApplicationRequest).subscribe({
        next: (application) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('application.default.successCreate')
          });
          this.closeDialog();
          this.loadApplication();
        },
        error: (error) => {
          console.error('Erro ao criar application:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('application.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de application
   */
  confirmDelete(application: Application): void {
    const confirmMessage = this.translationService.translate('application.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getApplicationDisplayText(application)),
      header: this.translationService.translate('application.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(application);
      }
    });
  }

  /**
   * Excluir application
   */
  private delete(application: Application): void {
    if (!application.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.applications = [];
    this.filteredApplications = [];
    
    this.applicationService.delete(application.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('application.default.successDelete')
        });
        this.loadApplication();
      },
      error: (error) => {
        console.error('Erro ao excluir application:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('application.default.errorDelete')
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
    this.selectedApplication = null;
    this.applicationForm.reset({
      idea: '',
      status: '',
      applicationDate: '',
      student: '',
      project: '',
    });
  }

  /**
   * Filtrar applications com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredApplications = [...this.applications];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredApplications = this.applications.filter(application => 
      (application.idea?.toLowerCase().includes(searchTermLower)) ||
      (application.status?.toLowerCase().includes(searchTermLower)) ||
      (application.applicationDate?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredApplications = [...this.applications];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do application
   */
  getApplicationDisplayText(application: Application): string {
    return application.idea || application.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para Student
   */
  loadStudentOptions(): void {
    this.studentService.list().subscribe({
      next: (items) => {
        this.fkStudentOptions = items.map((item: any) => ({
          label: item.name || item.id?.toString(), // Sempre exibir o ID se não houver name
          value: item.id
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
