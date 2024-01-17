import { ResolveFn } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { User } from '../../user/models/user';
import { inject } from '@angular/core';
import { UserService } from '../../user/user.service';
import { AuthService } from '../../auth/auth.service';

export const ownerResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);

  const user$ = authService.user$;

  return user$.pipe(
    take(1),
    switchMap((user)=> userService.getUser(user?.id!))
  )
};
