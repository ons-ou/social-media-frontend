import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { UserResponse } from '../../user/models/user-response';
import { UserService } from '../../user/user.service';
import { UserRole } from '../../user/models/stateEnum';

export const friendRequestsResolver: ResolveFn<UserResponse[]> = (route, state) => {
  const userService = inject(UserService);

  const sent = route.data["sent"]
  const s = sent? userService.getSentFriendRequests(): userService.getReceivedFriendRequests()

  return s.pipe(
    map((requests)=> {
      
      let users = requests.map((req)=> {
        const u = sent? req.to: req.from
        return {
        ...u,
        friendRequestId: req.id,
        state: sent? UserRole.SENT_REQUEST:  UserRole.RECEIVED_REQUEST
      } as UserResponse})

      return users;
    })
  );
};