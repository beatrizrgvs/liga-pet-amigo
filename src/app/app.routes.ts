
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/cadastro/cadastro').then(m => m.CadastroPage)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.HomePage)
  },
  {
    path: 'pet-virtual',
    loadComponent: () =>
      import('./pages/pet-virtual/pet-virtual').then(m => m.PetVirtualPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
