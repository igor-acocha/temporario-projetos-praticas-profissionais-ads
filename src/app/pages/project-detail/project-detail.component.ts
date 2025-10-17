import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../shared/interface/project.interface';
import { ProjectService } from '../../core/services/api/project.service';
import { SolutionProposalComponent } from './solution-proposal/solution-proposal.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, SolutionProposalComponent],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);

  project: Project | null = null;
  skills: string[] = [];
  deadline: string | null = null;
  loading = false;
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProject(id);
      } else {
        // fallback: first mock project
        const mock = this.getMockProjects();
        this.project = mock[0];
        this.skills = this.getMockSkills(this.project.id || '1');
        this.deadline = this.getMockDeadline(this.project.id || '1');
      }
    });
  }

  private loadProject(id: string): void {
    this.loading = true;
    this.projectService.getById(id).subscribe({
      next: (p) => {
        this.project = p;
        this.skills = this.getMockSkills(id);
        this.deadline = this.getMockDeadline(id);
        this.loading = false;
      },
      error: () => {
        const mock = this.getMockProjects();
        this.project = mock.find(m => m.id === id) || mock[0];
        const finalId = this.project?.id || id;
        this.skills = this.getMockSkills(finalId);
        this.deadline = this.getMockDeadline(finalId);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projetos-disponiveis']);
  }

  // --- Mock helpers (reutilizando os mesmos dados da tela de projetos) ---
  private getMockProjects(): Project[] {
    return [
      {
        id: '1',
        title: 'Sistema de Gestão Acadêmica',
        description: 'Desenvolver módulos para controle de cursos, alunos e matrículas.',
        status: 'OPEN',
        creationDate: '2024-01-15',
        entrepreneur: { id: '1', companyName: 'TechStart Solutions' } as any
      },
      {
        id: '2',
        title: 'E-commerce de Livros',
        description: 'Criar plataforma de vendas com carrinho, checkout e administração.',
        status: 'OPEN',
        creationDate: '2024-02-10',
        entrepreneur: { id: '2', companyName: 'BookMarket Ltda.' } as any
      },
      {
        id: '3',
        title: 'App de Entregas',
        description: 'Aplicativo mobile para roteirização de entregas com mapas e tracking.',
        status: 'OPEN',
        creationDate: '2024-03-02',
        entrepreneur: { id: '3', companyName: 'LogiTrack' } as any
      },
      {
        id: '4',
        title: 'Plataforma de Cursos Online',
        description: 'Sistema com aulas gravadas, quizzes e certificação.',
        status: 'OPEN',
        creationDate: '2024-04-20',
        entrepreneur: { id: '4', companyName: 'EduPro' } as any
      },
      {
        id: '5',
        title: 'Dashboard de Finanças',
        description: 'Visualização de KPIs financeiros, gráficos e relatórios.',
        status: 'OPEN',
        creationDate: '2024-05-05',
        entrepreneur: { id: '5', companyName: 'FinSight' } as any
      },
      {
        id: '6',
        title: 'Portal de Vagas Tech',
        description: 'Portal de vagas com filtros, candidatura e área do candidato.',
        status: 'OPEN',
        creationDate: '2024-06-12',
        entrepreneur: { id: '6', companyName: 'HireTech' } as any
      }
    ];
  }

  private getMockSkills(id: string): string[] {
    const map: Record<string, string[]> = {
      '1': ['Angular', 'TypeScript', 'RxJS', 'PrimeNG'],
      '2': ['Node.js', 'Express', 'MongoDB', 'JWT'],
      '3': ['React', 'Redux', 'REST', 'Jest'],
      '4': ['Flutter', 'Firebase', 'Geo APIs'],
      '5': ['Python', 'Pandas', 'Plotly', 'Docker'],
      '6': ['NestJS', 'PostgreSQL', 'CI/CD']
    };
    return map[id] || ['Comunicação', 'Trabalho em equipe'];
  }

  private getMockDeadline(id: string): string {
    const map: Record<string, string> = {
      '1': '30/11/2025',
      '2': '15/12/2025',
      '3': '20/12/2025',
      '4': '10/01/2026',
      '5': '05/12/2025',
      '6': '22/12/2025'
    };
    return map[id] || 'Data não informada';
  }
  
    // Métodos usados no header (mantendo o mesmo comportamento do home)
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  proposalVisible = false;

  openProposalModal(): void {
    this.proposalVisible = true;
  }

  onSubmitProposal(payload: { title: string; description: string; value: number | null }): void {
    // TODO: integrar com fluxo de envio da proposta
    console.log('Proposta enviada:', payload);
  }
}