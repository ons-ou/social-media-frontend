import { ResolveFn, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { inject } from '@angular/core';
import { catchError, combineLatest, of, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../user/models/user-response';
import { UserRole } from '../../user/models/stateEnum';

export const userResolver: ResolveFn<UserResponse | null> = (route, state) => {
  const id = route.queryParams['id'];
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const user$ = authService.user$;

  const userAndRequest$ = combineLatest([
    userService.getUser(id),
    userService.findRequest(id),
    userService.getAdmin(),
    user$,
  ]);

  return userAndRequest$.pipe(
    switchMap(([user, friendRequest, role, authUser]) => {
      const isOwner = authUser?.id === id;
      const isFriend = user.friendIds.indexOf(authUser?.id!) !== -1;
      let sentRequest = false;
      let receivedRequest = false;
      if (friendRequest) {
        sentRequest = authUser?.id === friendRequest.from.id;
        receivedRequest = authUser?.id === friendRequest.to.id;
      }

      let isAdmin =  role.id == id
      
      let state = isOwner? UserRole.OWNER :
      isFriend? UserRole.FRIEND :
      isAdmin? UserRole.ADMIN :
      sentRequest? UserRole.SENT_REQUEST:
      receivedRequest? UserRole.RECEIVED_REQUEST :
      UserRole.NONE;

      const result = {
        ...user,
        friendRequestId: friendRequest?.id ?? null,
        state
      };

      return of(result);
    }),
    catchError(() => {
      router.navigate(['/not-found']);
      return of(null);
    })
  );
};
