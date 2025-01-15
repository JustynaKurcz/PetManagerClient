import {CanActivateFn, Router} from '@angular/router';
import {UsersService} from "../services/users/users.service";
import {inject} from "@angular/core";
// import {LoadingService} from "../services/loading/loading.service";

export const authGuard: CanActivateFn  = async (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  // const loadingService = inject(LoadingService);
  //
  // loadingService.setLoading(true);

  try {
    const isLoggedIn = usersService.isLoggedIn();
    // loadingService.setLoading(false);

    if (isLoggedIn) {
      return true;
    }

    return router.navigate(['/zaloguj-sie']);
  } catch (error) {
    // loadingService.setLoading(false);
    return router.navigate(['/zaloguj sie']);
  }
};
