import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Register',
  },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'administrator',
    loadComponent: () => import('./pages/administrator/administrator.component').then(m => m.AdministratorComponent),
    title: 'Administrator',
  },
  {
    path: 'application',
    loadComponent: () => import('./pages/application/application.component').then(m => m.ApplicationComponent),
    title: 'Application',
  },
  {
    path: 'business-area',
    loadComponent: () => import('./pages/business-area/business-area.component').then(m => m.BusinessAreaComponent),
    title: 'BusinessArea',
  },
  {
    path: 'entrepreneur',
    loadComponent: () => import('./pages/entrepreneur/entrepreneur.component').then(m => m.EntrepreneurComponent),
    title: 'Entrepreneur',
  },
  {
    path: 'evaluation',
    loadComponent: () => import('./pages/evaluation/evaluation.component').then(m => m.EvaluationComponent),
    title: 'Evaluation',
  },
  {
    path: 'interest-area',
    loadComponent: () => import('./pages/interest-area/interest-area.component').then(m => m.InterestAreaComponent),
    title: 'InterestArea',
  },
  {
    path: 'project',
    loadComponent: () => import('./pages/project/project.component').then(m => m.ProjectComponent),
    title: 'Project',
  },
  {
    path: 'skill',
    loadComponent: () => import('./pages/skill/skill.component').then(m => m.SkillComponent),
    title: 'Skill',
  },
  {
    path: 'student',
    loadComponent: () => import('./pages/student/student.component').then(m => m.StudentComponent),
    title: 'Student',
  },

  // Redirecionamento principal:
  // Se o usuário acessar a raiz, o guard da rota '/home' decidirá o destino.
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // Rota curinga para qualquer outra URL não encontrada.
  // Direciona para a home, onde o guard fará a verificação novamente.
  {
    path: '**',
    redirectTo: '/home'
  }
];

