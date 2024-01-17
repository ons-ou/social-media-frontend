import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  merge,
  of,
  scan,
  switchMap,
  tap,
} from 'rxjs';
import { RequestCountService } from '../../services/request-count/request-count.service';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { PostService } from '../../post/post.service';

@Component({
  selector: 'app-icons-bar',
  standalone: true,
  imports: [RouterModule, DecimalPipe, AsyncPipe, ButtonModule, CommonModule],
  templateUrl: './icons-bar.component.html',
  styleUrl: './icons-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsBarComponent {
  @Input()
  userId: string | null = null;

  requestCountService = inject(RequestCountService);
  authService = inject(AuthService);
  userService = inject(UserService);
  postService = inject(PostService);
  count$: Observable<string>;
  authUser$ = this.authService.user$

  adminCount = new BehaviorSubject({
    id: '',
    count: 0,
  });
  admin$ = this.adminCount.asObservable();

  reset() {
    let val = this.adminCount.value;
    this.adminCount.next({ id: val.id, count: 0 });
  }

  constructor() {
    this.count$ = this.requestCountService.count$;
  }

  ngOnInit() {
    if (this.userId != null) {
      this.requestCountService.updateCount();
      combineLatest([this.userService.getAdmin(), this.authService.user$])
        .pipe(
          switchMap(([user, authUser]) =>
            combineLatest([
              of(user.id),
              this.postService.countLatestPosts(user.id, authUser?.logIn!),
            ])
          ),
          map(([id, countResult]) => ({
            id: id,
            count: countResult,
          })),
          tap((r) => this.adminCount.next(r))
        )
        .subscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
