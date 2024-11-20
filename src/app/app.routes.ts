import {Routes} from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
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
    path: 'pet/detail/:petId',
    loadComponent: () => import('./components/pets/pet-item-details/pet-item-details.component').then(m => m.PetItemDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pet/create',
    loadComponent: () => import('./components/pets/pet-create/pet-create.component').then(m => m.PetCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pet/health-record/:healthRecordId',
    loadComponent: () => import('./components/health-record/health-record.component').then(m => m.HealthRecordComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./components/user-account/user-account.component').then(m => m.UserAccountComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
