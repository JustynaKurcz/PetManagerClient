import {CanActivateFn, Router} from '@angular/router';
import {UsersService} from "../services/users/users.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn  = async (route, state) => {
  const usersService = inject(UsersService)
  const router = inject(Router)

  if (usersService.isLoggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['/zaloguj-sie'])
  }
};
