import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class RequestCountService {

  private countSubject = new BehaviorSubject("0");
  public count$ = this.countSubject.asObservable()

  userService = inject(UserService);

  public updateCount(){
    this.userService.getReceivedFriendRequestsCount().subscribe(
      (c)=> {
        this.countSubject.next(c)
      }
    )
  }
}
