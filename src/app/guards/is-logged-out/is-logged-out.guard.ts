import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const isLoggedOutGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService)
  let router = inject(Router)
  
  return authService.isLoggedOut$.pipe(
    tap((val)=>{
      !val && router.navigate(['/feed'])
    })
  );
};