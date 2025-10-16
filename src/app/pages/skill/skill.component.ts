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
import { SkillService } from '../../core/services/api/skill.service';
import { StudentService } from '../../core/services/api/student.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Skill, CreateSkillRequest, UpdateSkillRequest } from '../../shared/interface/skill.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-skill',
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
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss',
  animations: [pageEnterAnimation]
})
export class SkillComponent implements OnInit {
  private skillService = inject(SkillService);
  private studentService = inject(StudentService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  selectedSkill: Skill | null = null;
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
  skillForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.skillForm = this.fb.group({
      name: ['', [notBlankValidator(), Validators.maxLength(100)]],
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: [[]],
    });
    this.loadSkill();
    
    // Load all related entity options
    this.loadStudentOptions();
  }

  /**
   * Carregar lista de skills
   */
  loadSkill(): void {
    this.skills = [];
    this.filteredSkills = [];
    this.loading = true;
    this.skillService.list().subscribe({
      next: (skills) => {
        this.skills = skills;
        this.filteredSkills = [...skills];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar skills:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('skill.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo skill
   */
  newSkill(): void {
    this.skillForm.reset({
      name: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: [],
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar skill
   */
  edit(skill: Skill): void {
    this.skillForm.setValue({
      name: skill.name || '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: skill.students ? skill.students.map((item: any) => item.id) : [],
    });
    this.selectedSkill = skill;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar skill (criar ou atualizar)
   */
  save(): void {
    if (this.skillForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.skills = [];
    this.filteredSkills = [];
    
    const formValue = this.skillForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    
    
    // Transformar relacionamentos Many-to-Many em array de objetos com id (apenas o lado pai da relação)
    if (formValue.students && Array.isArray(formValue.students)) {
      formValue.students = formValue.students.map((id: string) => ({ id }));
    }
    if (this.isEditing && this.selectedSkill?.id) {
      // Atualizar skill existente
      this.skillService.update(this.selectedSkill.id, formValue as UpdateSkillRequest).subscribe({
        next: (skill) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('skill.default.successUpdate')
          });
          this.closeDialog();
          this.loadSkill();
        },
        error: (error) => {
          console.error('Erro ao atualizar skill:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('skill.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo skill
      this.skillService.create(formValue as CreateSkillRequest).subscribe({
        next: (skill) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('skill.default.successCreate')
          });
          this.closeDialog();
          this.loadSkill();
        },
        error: (error) => {
          console.error('Erro ao criar skill:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('skill.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de skill
   */
  confirmDelete(skill: Skill): void {
    const confirmMessage = this.translationService.translate('skill.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getSkillDisplayText(skill)),
      header: this.translationService.translate('skill.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(skill);
      }
    });
  }

  /**
   * Excluir skill
   */
  private delete(skill: Skill): void {
    if (!skill.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.skills = [];
    this.filteredSkills = [];
    
    this.skillService.delete(skill.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('skill.default.successDelete')
        });
        this.loadSkill();
      },
      error: (error) => {
        console.error('Erro ao excluir skill:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('skill.default.errorDelete')
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
    this.selectedSkill = null;
    this.skillForm.reset({
      name: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
      students: [],
    });
  }

  /**
   * Filtrar skills com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredSkills = [...this.skills];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredSkills = this.skills.filter(skill => 
      (skill.name?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredSkills = [...this.skills];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do skill
   */
  getSkillDisplayText(skill: Skill): string {
    return skill.name || skill.id?.toString() || 'ID não disponível';
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
