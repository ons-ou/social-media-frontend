import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { UserResponse } from '../../models/user-response';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Observable, Subject, combineLatest, map, merge, tap } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UserRole } from '../../models/stateEnum';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    MenubarModule,
    CommonModule,
    RouterOutlet,
    AsyncPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  items$!: Observable<MenuItem[]>;
  user$!: Observable<UserResponse>;
  userState$!: Observable<string>

  userSubject = new Subject<string>();

  authService = inject(AuthService);
  router = inject(Router);

  constructor(private route: ActivatedRoute) {
    this.user$ = merge(
      this.route.data.pipe(
        map((data) => {
          return data['user'];
        })
      ),
    );

    this.userState$ = merge(this.userSubject, this.user$.pipe(
      map((u)=> u.state)
    ))

    this.items$ = combineLatest([this.authService.user$, this.userState$]).pipe(
      map(([creds, state]) => this.generateItems(state, creds?.role!))
    );
  }

  generateItems(state: string, role: string): MenuItem[] {
    const id = this.route.snapshot.queryParams['id']
    const isModerator =
      state == UserRole.OWNER && state == UserRole.ADMIN;

    const items: MenuItem[] = [
      {
        label: 'Personal Info',
        routerLink: '/profile',
        queryParams: {
          id: id,
        },
      },
      {
        label: 'Posts',
        routerLink: 'posts',
        queryParams: {
          id: id,
        },
      },
    ];

    if ([UserRole.FRIEND, UserRole.OWNER, UserRole.ADMIN].includes(state) || role === 'MODERATOR'){
      items.push(
        {
          label: 'Shared Posts',
          routerLink: 'posts/shared',
          queryParams: {
            id: id,
          },
        },
        {
          label: 'Liked Posts',
          routerLink: 'posts/liked',
          queryParams: {
            id: id,
          },
        }
      );

      if (state !== UserRole.ADMIN) {
        items.push({
          label: 'Friends',
          routerLink: 'friends',
          queryParams: {
            id: id,
          },
        });
      }
    }

    if (state == UserRole.OWNER && !isModerator) {
      items.push({
        label: 'Friend Requests',
        items: [
          {
            label: 'Sent Requests',
            routerLink: 'sent-requests',
            queryParams: {
              id: id,
            },
          },
          {
            label: 'Received Requests',
            routerLink: 'received-requests',
            queryParams: {
              id: id,
            },
          },
        ],
      });
    }

    return items;
  }

  updateItems(user: string) {
    this.userSubject.next(user);
  }
}
