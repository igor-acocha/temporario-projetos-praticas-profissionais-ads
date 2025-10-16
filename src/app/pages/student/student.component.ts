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
import { StudentService } from '../../core/services/api/student.service';
import { InterestAreaService } from '../../core/services/api/interest-area.service';
import { SkillService } from '../../core/services/api/skill.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslationService } from '../../core/services/translation.service';

// Interfaces
import { Student, CreateStudentRequest, UpdateStudentRequest } from '../../shared/interface/student.interface';

// Pipes
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Animations
import { pageEnterAnimation } from '../../shared/animations';

// Icon field
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-student',
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
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  animations: [pageEnterAnimation]
})
export class StudentComponent implements OnInit {
  private studentService = inject(StudentService);
  private interestAreaService = inject(InterestAreaService);
  private skillService = inject(SkillService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  // Data
  students: Student[] = [];
  filteredStudents: Student[] = [];
  selectedStudent: Student | null = null;
  loading = false;

  // Dropdown options
  interestAreaOptions: any[] = [];
  skillOptions: any[] = [];

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
  studentForm!: FormGroup;

  ngOnInit(): void {
    // FormGroup para tabela normal
    this.studentForm = this.fb.group({
      name: ['', [notBlankValidator(), Validators.maxLength(150)]],
      phone: ['', [notBlankValidator(), Validators.maxLength(50)]],
      email: ['', [notBlankValidator(), Validators.maxLength(150)]],
      description: ['', [notBlankValidator()]],
      registrationDate: ['', []],
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
    this.loadStudent();
    
    // Load all related entity options
    this.loadInterestAreaOptions();
    this.loadSkillOptions();
  }

  /**
   * Carregar lista de students
   */
  loadStudent(): void {
    this.students = [];
    this.filteredStudents = [];
    this.loading = true;
    this.studentService.list().subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = [...students];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar students:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('student.default.errorLoadList')
        });
        this.loading = false;
      }
    });
  }

  /**
   * Abrir dialog para criar novo student
   */
  newStudent(): void {
    this.studentForm.reset({
      name: '',
      phone: '',
      email: '',
      description: '',
      registrationDate: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
    this.isEditing = false;
    this.displayDialog = true;
  }

  /**
   * Abrir dialog para editar student
   */
  edit(student: Student): void {
    this.studentForm.setValue({
      name: student.name || '',
      phone: student.phone || '',
      email: student.email || '',
      description: student.description || '',
      registrationDate: student.registrationDate || '',
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
    this.selectedStudent = student;
    this.isEditing = true;
    this.displayDialog = true;
  }

  /**
   * Salvar student (criar ou atualizar)
   */
  save(): void {
    if (this.studentForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translationService.translate('common.warnTitle'),
        detail: this.translationService.translate('common.requiredFields')
      });
      return;
    }
    
    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.students = [];
    this.filteredStudents = [];
    
    const formValue = this.studentForm.value;
    
    // Transformar campos de relacionamento FK em objetos com id
    
    
    // Transformar relacionamentos Many-to-Many em array de objetos com id (apenas o lado pai da relação)
    if (this.isEditing && this.selectedStudent?.id) {
      // Atualizar student existente
      this.studentService.update(this.selectedStudent.id, formValue as UpdateStudentRequest).subscribe({
        next: (student) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('student.default.successUpdate')
          });
          this.closeDialog();
          this.loadStudent();
        },
        error: (error) => {
          console.error('Erro ao atualizar student:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('student.default.errorUpdate')
          });
          this.loading = false;
        }
      });
    } else {
      // Criar novo student
      this.studentService.create(formValue as CreateStudentRequest).subscribe({
        next: (student) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translationService.translate('common.successTitle'),
            detail: this.translationService.translate('student.default.successCreate')
          });
          this.closeDialog();
          this.loadStudent();
        },
        error: (error) => {
          console.error('Erro ao criar student:', error);
          this.messageService.add({
            severity: 'error',
            summary: this.translationService.translate('common.errorTitle'),
            detail: this.translationService.translate('student.default.errorCreate')
          });
          this.loading = false;
        }
      });
    }
  }

  /**
   * Confirmar exclusão de student
   */
  confirmDelete(student: Student): void {
    const confirmMessage = this.translationService.translate('student.default.confirmDeleteMessage');
    this.confirmationService.confirm({
      message: String(confirmMessage).replace('{name}', this.getStudentDisplayText(student)),
      header: this.translationService.translate('student.default.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translationService.translate('common.accept'),
      rejectLabel: this.translationService.translate('common.reject'),
      accept: () => {
        this.delete(student);
      }
    });
  }

  /**
   * Excluir student
   */
  private delete(student: Student): void {
    if (!student.id) return;

    // Limpar tabela imediatamente e ativar loading
    this.loading = true;
    this.students = [];
    this.filteredStudents = [];
    
    this.studentService.delete(student.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate('common.successTitle'),
          detail: this.translationService.translate('student.default.successDelete')
        });
        this.loadStudent();
      },
      error: (error) => {
        console.error('Erro ao excluir student:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('student.default.errorDelete')
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
    this.selectedStudent = null;
    this.studentForm.reset({
      name: '',
      phone: '',
      email: '',
      description: '',
      registrationDate: '',
      // Many-to-Many relationships (apenas o lado pai da relação)
    });
  }

  /**
   * Filtrar students com base no termo de busca
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredStudents = this.students.filter(student => 
      (student.name?.toLowerCase().includes(searchTermLower)) ||
      (student.phone?.toLowerCase().includes(searchTermLower)) ||
      (student.email?.toLowerCase().includes(searchTermLower)) ||
      (student.description?.toLowerCase().includes(searchTermLower)) ||
      (student.registrationDate?.toLowerCase().includes(searchTermLower)) ||
      false
    );
  }

  /**
   * Limpar busca
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredStudents = [...this.students];
  }

  /**
   * Ordenar dados da tabela
   */
  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
  }

  /**
   * Obter texto de exibição do student
   */
  getStudentDisplayText(student: Student): string {
    return student.name || student.id?.toString() || 'ID não disponível';
  }

  /**
   * Carregar opções para InterestArea
   */
  loadInterestAreaOptions(): void {
    this.interestAreaService.list().subscribe({
      next: (items) => {
        this.interestAreaOptions = items.map((item: any) => ({
          id: item.id,
          name: item.name || item.id?.toString() // Sempre exibir o ID se não houver name
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar opções de interestArea:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('interest-area.errorLoadOptions')
        });
      }
    });
  }



  /**
   * Carregar opções para Skill
   */
  loadSkillOptions(): void {
    this.skillService.list().subscribe({
      next: (items) => {
        this.skillOptions = items.map((item: any) => ({
          id: item.id,
          name: item.name || item.id?.toString() // Sempre exibir o ID se não houver name
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar opções de skill:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('skill.errorLoadOptions')
        });
      }
    });
  }



}
