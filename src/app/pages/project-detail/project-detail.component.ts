import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../shared/interface/project.interface';
import { ProjectService } from '../../core/services/api/project.service';
import { SolutionProposalComponent } from './solution-proposal/solution-proposal.component';
import { TranslationService } from '../../core/services/translation.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/api/application.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notBlankValidator } from '../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, SolutionProposalComponent],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  @ViewChild('proposalComponent') proposalComponent!: SolutionProposalComponent;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);
  private authService = inject(AuthService);
  private applicationService = inject(ApplicationService);
  private formBuilder = inject(FormBuilder);

  project: Project | null = null;
  skills: string[] = [];
  deadline: string | null = null;
  loading = false;
  currentYear = new Date().getFullYear();
  selectedProjectId: string = '';

  applicationForm!: FormGroup;

  ngOnInit(): void {
    this.loadProjectById(this.route.snapshot.paramMap.get('id') || '');
    this.selectedProjectId = this.route.snapshot.paramMap.get('id')!;
  }

  loadProjectById(projectId: string): void {
    this.loading = true;
    this.projectService.getById(projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar project:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate('common.errorTitle'),
          detail: this.translationService.translate('project.default.errorLoad')
        });
        this.loading = false;
      }
    });
  }


  goBack(): void {
    this.router.navigate(['/projects']);
  }

  proposalVisible = false;

  openProposalModal(): void {
    this.proposalVisible = true;
  }


  onSubmitProposal(data: { title: string; description: string; value: number | null }): void {
    const selectedProjectId = this.selectedProjectId;

    const applicationData = {
      idea: data.title,       
      value: data.value || 0, 
      idProject: selectedProjectId || ''  
    };

    this.applicationService.create(applicationData).subscribe({
      next: () => {
        this.proposalComponent?.showSuccess();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Falha ao enviar aplicação.'
        });

        this.proposalComponent?.resetForm();
      }
    });
  }


}