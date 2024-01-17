import { ResolveFn } from '@angular/router';
import { UserService } from '../../user/user.service';
import { inject } from '@angular/core';
import { combineLatest, forkJoin, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { UserResponse } from '../../user/models/user-response';

export const friendsResolver: ResolveFn<UserResponse[]> = (route, state) => {
  const id = route.queryParams['id'];
  const userService = inject(UserService);
  const authService = inject(AuthService);

  return combineLatest([
    userService.getFriends(id),
    userService.getSentFriendRequests(),
    userService.getReceivedFriendRequests(),
    authService.user$,
  ]).pipe(
    switchMap(([users, sent, received, authUser]) => {
      const myId = authUser?.id || '';

        users = users.map((user) => {
          const isOwner = user.id == myId;
          const isFriend = user.friendIds.includes(myId);
          const sentRequest = sent.some((request) => request.to.id === user.id);
          const receivedRequest = received.some((request) => request.from.id === user.id);
          const friendRequest = received.find((request) => request.from.id === user.id);

          return {
            ...user,
            isOwner,
            isFriend,
            sentRequest,
            receivedRequest,
            friendRequestId: friendRequest?.id || null,
          };
        })

        console.log(users)
      return of(users);
    })
  );
};