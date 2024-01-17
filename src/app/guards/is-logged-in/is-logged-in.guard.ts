import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { tap } from 'rxjs';

export const isLoggedInGuard: CanActivateFn = (route, state) => {

  let authService = inject(AuthService)
  let router = inject(Router);
  
  return authService.isLoggedIn$.pipe(
    tap((val)=>{
      !val && router.navigate(['/login'])
    })
  );;
};
