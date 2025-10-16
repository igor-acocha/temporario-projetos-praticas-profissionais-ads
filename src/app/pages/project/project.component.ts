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
import { ProjectService } from '../../core/services/api/project.service';
import { EntrepreneurService } from '../../core/services/api/entrepreneur.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../shared/interface/project.interface';
import { Entrepreneur } from '../../shared/interface/entrepreneur.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-project',
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
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  animations: [pageEnterAnimation]
})
export class ProjectComponent implements OnInit {
  private projectService = inject(ProjectService);
  private entrepreneurService = inject(EntrepreneurService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  loading = false;

  // Dropdown options
  fkEntrepreneurOptions: any[] = [];

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
  projectForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.projectForm = this.fb.group({
      title: ['', [notBlankValidator(), Validators.maxLength(150)]],
      description: ['', [notBlankValidator()]],
      status: ['', [notBlankValidator()]],
      creationDate: ['', []],
      entrepreneur: ['', [notBlankValidator(), Validators.maxLength(36)]],
    });
    this.loadProject();
    
    // Load all related entity options
    this.loadEntrepreneurOptions();
  }

  /**
   * Carregar lista de projects
   */
  loadProject(): void {
    this.projects = [];
    this.filteredProjects = [];
    this.loading = true;
    this.projectService.list().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.filteredProjects = [...projects];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar projects:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('project.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo project
   */
  newProject(): void {
    this.projectForm.reset({
      title: '',
      description: '',
      status: '',
      creationDate: '',
      entrepreneur: '',
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar project
   */
  edit(project: Project): void {
    this.projectForm.setValue({
      title: project.title || '',
      description: project.description || '',
      status: project.status || '',
      creationDate: project.creationDate || '',
      entrepreneur: project.entrepreneur?.id || '',
    });
    this.selectedProject = project;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar project (criar ou atualizar)
   */
  save(): void {
    if (this.projectForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.projects = [];
    this.filteredProjects = [];
    
    const formValue = this.projectForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    // FK Simples - envolver em objeto { id: "..." }
    if (formValue.entrepreneur) {
      formValue.entrepreneur = { id: formValue.entrepreneur };
    }
    
    
    if (this.isEditing && this.selectedProject?.id) {
      // Atualizar project existente
      this.projectService.update(this.selectedProject.id, formValue as UpdateProjectRequest).subscribe({
        next: (project) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('project.default.successUpdate')
          });
          this.closeDialog();
          this.loadProject();
        },
        error: (error) => {
          console.error('Erro ao atualizar project:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('project.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo project
      this.projectService.create(formValue as CreateProjectRequest).subscribe({
        next: (project) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('project.default.successCreate')
          });
          this.closeDialog();
          this.loadProject();
        },
        error: (error) => {
          console.error('Erro ao criar project:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('project.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de project
   */
  confirmDelete(project: Project): void {
    const confirmMessage = this.translationService.translate('project.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getProjectDisplayText(project)),
      header: this.translationService.translate('project.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(project);
      }
    });
  }

  /**
   * Excluir project
   */
  private delete(project: Project): void {
    if (!project.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.projects = [];
    this.filteredProjects = [];
    
    this.projectService.delete(project.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('project.default.successDelete')
        });
        this.loadProject();
      },
      error: (error) => {
        console.error('Erro ao excluir project:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('project.default.errorDelete')
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
    this.selectedProject = null;
    this.projectForm.reset({
      title: '',
      description: '',
      status: '',
      creationDate: '',
      entrepreneur: '',
    });
  }

  /**
   * Filtrar projects com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProjects = [...this.projects];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredProjects = this.projects.filter(project => 
      (project.title?.toLowerCase().includes(searchTermLower)) ||
      (project.description?.toLowerCase().includes(searchTermLower)) ||
      (project.status?.toLowerCase().includes(searchTermLower)) ||
      (project.creationDate?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProjects = [...this.projects];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do project
   */
  getProjectDisplayText(project: Project): string {
    return project.title || project.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para Entrepreneur
   */
  loadEntrepreneurOptions(): void {
    this.entrepreneurService.list().subscribe({
      next: (items) => {
        this.fkEntrepreneurOptions = items.map((item: any) => ({
          label: item.name || item.id?.toString(), // Sempre exibir o ID se não houver name
          value: item.id
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
