import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UsersService} from "../../services/users/users.service";
import {firstValueFrom} from "rxjs";

export const adminGuard: CanActivateFn = async (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  if (!usersService.isLoggedIn()) {
    await router.navigate(['/zaloguj-sie']);
    return false;
  }

  try {
    const isAdmin = await firstValueFrom(usersService.isAdmin());
    if (!isAdmin) {
      await router.navigate(['/']);
      return false;
    }
    return true;
  } catch {
    await router.navigate(['/']);
    return false;
  }
};
