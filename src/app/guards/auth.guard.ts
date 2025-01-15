import {CanActivateFn, Router} from '@angular/router';
import {UsersService} from "../services/users/users.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = async (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  try {
    const isLoggedIn = usersService.isLoggedIn();

    if (isLoggedIn) {
      return true;
    }

    return router.navigate(['/zaloguj-sie']);
  } catch (error) {

    return router.navigate(['/zaloguj sie']);
  }
};
