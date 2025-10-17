import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Entrepreneur } from '../../shared/interface/entrepreneur.interface';
import { EntrepreneurService } from '../../core/services/api/entrepreneur.service';

@Component({
  selector: 'app-perfil-entrepreneur',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './perfil-entrepreneur.component.html',
  styleUrls: ['./perfil-entrepreneur.component.scss']
})
export class PerfilEntrepreneurComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private entrepreneurService = inject(EntrepreneurService);

  entrepreneur: Entrepreneur | null = null;
  loading = false;
  currentYear = new Date().getFullYear();
  ratingsCount: number = 124;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadEntrepreneur(id);
      } else {
        this.setMockEntrepreneur();
      }
    });
  }

  private loadEntrepreneur(id: string): void {
    this.loading = true;
    this.entrepreneurService.getById(id).subscribe({
      next: (e) => {
        this.entrepreneur = e;
        this.loading = false;
      },
      error: () => {
        // Fallback para visualizar a página mesmo sem backend
        this.setMockEntrepreneur(id);
        this.loading = false;
      }
    });
  }

  private setMockEntrepreneur(id: string = '1'): void {
    const mocks: Record<string, Entrepreneur> = {
      '1': {
        id: '1',
        companyName: 'TechStart Solutions',
        description: 'Empresa focada em soluções tecnológicas para educação e inovação. Atuamos com desenvolvimento de plataformas web, mobile e integrações.',
        email: 'contato@techstart.com',
        phone: '+55 (11) 99999-9999',
        cnpj: '00.000.000/0001-00',
        registrationDate: '2015-08-01',
        foundedYear: '2015',
        city: 'São Paulo',
        state: 'SP',
        segment: 'Tecnologia da Informação',
        employees: 42,
        taxId: 'TechStart Solutions LTDA'
      },
      '2': {
        id: '2',
        companyName: 'BookMarket Ltda.',
        description: 'Plataforma de e-commerce especializada em venda de livros, com foco em experiência do usuário e logística eficiente.',
        email: 'contato@bookmarket.com',
        phone: '+55 (21) 98888-8888',
        cnpj: '00.000.000/0002-00',
        registrationDate: '2012-05-10',
        foundedYear: '2012',
        city: 'Rio de Janeiro',
        state: 'RJ',
        segment: 'E-commerce',
        employees: 28,
        taxId: 'BookMarket Ltda.'
      },
      '3': {
        id: '3',
        companyName: 'LogiTrack',
        description: 'Soluções para roteirização e rastreamento de entregas, com integração de mapas e monitoramento em tempo real.',
        email: 'contato@logitrack.com',
        phone: '+55 (41) 97777-7777',
        cnpj: '00.000.000/0003-00',
        registrationDate: '2018-03-18',
        foundedYear: '2018',
        city: 'Curitiba',
        state: 'PR',
        segment: 'Logística',
        employees: 60,
        taxId: 'LogiTrack Tecnologia S.A.'
      },
      '4': {
        id: '4',
        companyName: 'EduPro',
        description: 'Plataforma de cursos online com aulas gravadas, quizzes e certificação, voltada para educação corporativa e individual.',
        email: 'contato@edupro.com',
        phone: '+55 (31) 96666-6666',
        cnpj: '00.000.000/0004-00',
        registrationDate: '2016-09-22',
        foundedYear: '2016',
        city: 'Belo Horizonte',
        state: 'MG',
        segment: 'Educação',
        employees: 35,
        taxId: 'EduPro Educação Digital Ltda.'
      },
      '5': {
        id: '5',
        companyName: 'FinSight',
        description: 'Dashboard e análises financeiras com visualização de KPIs, gráficos e relatórios para empresas de diversos segmentos.',
        email: 'contato@finsight.com',
        phone: '+55 (11) 95555-5555',
        cnpj: '00.000.000/0005-00',
        registrationDate: '2014-11-03',
        foundedYear: '2014',
        city: 'São Paulo',
        state: 'SP',
        segment: 'Finanças/Analytics',
        employees: 22,
        taxId: 'FinSight Análises Financeiras Ltda.'
      },
      '6': {
        id: '6',
        companyName: 'HireTech',
        description: 'Portal de vagas voltado para o mercado de tecnologia, com filtros avançados e candidatura simplificada.',
        email: 'contato@hiretech.com',
        phone: '+55 (48) 94444-4444',
        cnpj: '00.000.000/0006-00',
        registrationDate: '2019-01-12',
        foundedYear: '2019',
        city: 'Florianópolis',
        state: 'SC',
        segment: 'Recursos Humanos/Tech',
        employees: 18,
        taxId: 'HireTech RH Digital Ltda.'
      }
    };

    this.entrepreneur = mocks[id] || mocks['1'];
  }

  goBack(): void {
    // Voltar para a tela anterior; se não houver histórico, ir para Projetos Disponíveis
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/projetos-disponiveis']);
    }
  }

  // Métodos usados no header
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}