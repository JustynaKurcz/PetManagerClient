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
    path: 'pet/detail/:petId',
    loadComponent: () => import('./components/pets/pet-item-details/pet-item-details.component').then(m => m.PetItemDetailsComponent)
  },
  {
    path: 'pet/create',
    loadComponent: () => import('./components/pets/pet-create/pet-create.component').then(m => m.PetCreateComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
