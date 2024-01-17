import { CommonModule, AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import {
  Observable,
  Subject,
  filter,
  tap,
  of,
  map,
  merge,
  switchMap,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { ImagePipe } from '../../../pipes/image.pipe';
import { UserResponse } from '../../models/user-response';
import { UserService } from '../../user.service';
import { RequestCountService } from '../../../services/request-count/request-count.service';
import { UserRole } from '../../models/stateEnum';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.css',
  imports: [
    CommonModule,
    ConfirmPopupModule,
    RouterModule,
    ImagePipe,
    AsyncPipe,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileButtonComponent {
  @Input()
  id!: string;
  @Input()
  state!: string;
  @Input()
  requestId!: string | null;
  @Input()
  name!: string;

  countService = inject(RequestCountService);
  userService = inject(UserService);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  stateSubject = new BehaviorSubject<string>(UserRole.NONE);
  clickSubject = new Subject();

  icon$!: Observable<string>;
  role!: string;

  @Output()
  updateItems = new EventEmitter<string>();

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      data['user'] ? this.stateSubject.next(data['user'].state):
      this.stateSubject.next(this.state);
    });

    this.icon$ = combineLatest([
      this.stateSubject,
      this.authService.user$,
    ]).pipe(
      tap(([_, user]) => (this.role = user?.role!)),
      map(([state, user]) => this.setIcon(state, user?.role!))
    );
  }

  setIcon(state: string, role: string) {
    if (role == 'MODERATOR') {
      return 'pi pi-ban';
    }
    let icon;
    switch (state) {
      case UserRole.SENT_REQUEST:
        icon = 'pi pi-times';
        break;
      case UserRole.RECEIVED_REQUEST:
        icon = 'pi pi-check';
        break;
      case UserRole.FRIEND:
        icon = 'pi pi-user-minus';
        break;
      case UserRole.OWNER:
        icon = 'pi pi-pencil';
        break;
      default:
        icon = 'pi pi-user-plus';
        break;
    }
    return icon;
  }

  onClick(event: Event) {
    let state = this.stateSubject.value;
    if (this.role == 'MODERATOR') {
      return this.deleteUser(event);
    }
    switch (state) {
      case UserRole.SENT_REQUEST:
        this.cancelRequest();
        break;
      case UserRole.RECEIVED_REQUEST:
        this.answerRequest(event);
        break;
      case UserRole.FRIEND:
        this.removeFriend();
        break;
      case UserRole.OWNER:
        this.editUser();
        break;
      default:
        this.addFriend();
        break;
    }
  }

  answerRequest(event?: Event) {
    return this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Accept Friend Request?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.acceptRequest();
      },
      reject: () => {
        this.cancelRequest();
      },
    });
  }

  deleteUser(event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Do you want to ban this user',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(this.id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: 'User deleted.',
          });
          this.router.navigate(['/feed']);
        });
      },
    });
  }

  addFriend() {
    this.userService
      .sendFriendRequest(this.id)
      .pipe(
        tap((f) => {
          this.requestId = f.id;
          this.messageService.add({
            severity: 'success',
            detail: 'Friend Request sent.',
          });
        })
      )
      .subscribe(() => {
        this.stateSubject.next(UserRole.SENT_REQUEST);
      });
  }

  acceptRequest() {
    this.userService
      .acceptFriendRequest(this.requestId!)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            detail: `${this.name} is now your friend`,
          });
        })
      )
      .subscribe(() => {
        this.countService.updateCount();
        this.stateSubject.next(UserRole.FRIEND);
        this.updateItems.emit(UserRole.FRIEND);
      });
  }

  cancelRequest() {
    this.userService
      .deleteFriendRequest(this.requestId!)
      .pipe(
        tap(() => {
          this.requestId = null;
          this.messageService.add({
            severity: 'success',
            detail: `Request canceled.`,
          });
        })
      )
      .subscribe(() => {
        this.stateSubject.next(UserRole.NONE);
        this.updateItems.emit(UserRole.NONE);
      });
  }

  removeFriend() {
    return this.userService
      .removeFriend(this.id)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            detail: `${this.name} is no longer your friend`,
          });
        })
      )
      .subscribe(() => this.stateSubject.next(UserRole.NONE));
  }

  editUser() {
    this.router.navigate(['/edit-profile']);
  }
}
