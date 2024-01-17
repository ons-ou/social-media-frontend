import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { switchMap, take } from 'rxjs';
import { UserCredentials } from '../../auth/dtos/userCredentials';

export const addIdInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.user$.pipe(
    take(1),
    switchMap( (user: UserCredentials | null) =>{
      if (user != null) {
        req = req.clone({
          params: req.params.set("userId", user.id),
        });
      }
      return next(req);
    })
  )
};


