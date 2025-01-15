import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'moje-zwierzaki',
    pathMatch: 'full'
  },
  {
    path: 'zaloguj-sie',
    loadComponent: () => import('./components/auth/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'zarejestruj-sie',
    loadComponent: () => import('./components/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'pet/detail/:petId',
    loadComponent: () => import('./components/pet-details/pet-details.component').then(m => m.PetDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'pet/health-record/:healthRecordId',
    loadComponent: () => import('./components/health-record/health-record.component').then(m => m.HealthRecordComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/my-account/my-account.component').then(m => m.MyAccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-zwierzaki',
    loadComponent: () => import('./components/my-pets/my-pets.component').then(m => m.MyPetsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
