import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { Project } from '../../shared/interface/project.interface';
import { ProjectService } from '../../core/services/api/project.service';

@Component({
  selector: 'app-available-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './available-projects.component.html',
  styleUrls: ['./available-projects.component.scss']
})
export class AvailableProjectsComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projects: Project[] = [];
  displayedProjects: Project[] = [];
  loading = false;

  // Paginação simples "carregar mais"
  pageSize = 6;
  private displayCount = this.pageSize;

  // Mock com 6 projetos para visualização
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

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit() {
    // Quando a navegação termina, checa fragmento e rola para o elemento
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    });
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.list().subscribe({
      next: (projects) => {
        const result = projects && projects.length ? projects : this.getMockProjects();
        this.projects = result;
        this.displayCount = this.pageSize;
        this.updateDisplayed();
        this.loading = false;
      },
      error: () => {
        // Fallback para mock em caso de erro
        this.projects = this.getMockProjects();
        this.displayCount = this.pageSize;
        this.updateDisplayed();
        this.loading = false;
      }
    });
  }

  updateDisplayed(): void {
    this.displayedProjects = this.projects.slice(0, this.displayCount);
  }

  hasMore(): boolean {
    return this.displayedProjects.length < this.projects.length;
  }

  loadMore(): void {
    if (!this.hasMore()) return;
    this.displayCount = Math.min(this.displayCount + this.pageSize, this.projects.length);
    this.updateDisplayed();
  }

  goToProjectDetails(project: Project): void {
    if (project?.id) {
      this.router.navigate(['/project-detail', project.id]);
    } else {
      this.router.navigate(['/project-detail', '1']);
    }
  }

  // Métodos usados no header (mantendo o mesmo comportamento do home)
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}