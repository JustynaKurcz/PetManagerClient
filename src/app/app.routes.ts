import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth/auth.guard";
import {adminGuard} from "./guards/admin/admin.guard";

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
    path: 'resetuj-haslo',
    loadComponent: () => import('./components/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'pet/detail/:petId',
    loadComponent: () => import('./components/pet-details/pet-details.component').then(m => m.PetDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-konto',
    loadComponent: () => import('./components/my-account/my-account.component').then(m => m.MyAccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-zwierzaki',
    loadComponent: () => import('./components/my-pets/my-pets.component').then(m => m.MyPetsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent)

  },
  {
    path: 'o-aplikacji',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'panel-administratora',
    loadComponent: () => import('./components/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
