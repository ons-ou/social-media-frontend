import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { catchError, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  if (req.url.includes('login') || req.url.includes('register')) return next(req);

  return authService.isLoggedIn$.pipe(
    switchMap((isLoggedIn) => {
      if (isLoggedIn) {
        let token = JSON.parse(cookieService.get('user')!).token;
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(req);
    })
  );
};
