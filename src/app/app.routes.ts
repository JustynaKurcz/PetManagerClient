import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./components/auth/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./components/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'pets',
    loadComponent: () => import('./components/pet-list/pet-list.component').then(m => m.PetListComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
