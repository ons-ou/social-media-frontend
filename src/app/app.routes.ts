import { Routes } from '@angular/router';
import { HeroPageComponent } from './components/hero-page/hero-page/hero-page.component';
import { LoginComponent } from './auth/components/login/login.component';
import { isLoggedOutGuard } from './guards/is-logged-out/is-logged-out.guard';
import { SignupComponent } from './auth/components/signup/signup.component';
import { isLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AddPostComponent } from './post/components/add-post/add-post.component';
import { unsavedChangesGuard } from './guards/unsaved-changes/unsaved-changes.guard';
import { ProfileComponent } from './user/components/profile/profile.component';
import { userResolver } from './resolvers/user/user.resolver';
import { PersonalInfoComponent } from './user/components/personal-info/personal-info.component';
import { postResolver } from './resolvers/post/post.resolver';
import { ownerResolver } from './resolvers/owner/owner.resolver';
import { EditProfileComponent } from './user/components/edit-profile/edit-profile.component';
import { FriendListComponent } from './user/components/friend-list/friend-list.component';
import { friendsResolver } from './resolvers/friends/friends.resolver';
import { friendRequestsResolver } from './resolvers/friend-requests/friend-requests.resolver';
import { PostListComponent } from './post/components/post-list/post-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HeroPageComponent,
    canActivate: [isLoggedOutGuard],
  },
  {
    path: 'posts',
    children: [
      {
        path: 'add',
        component: AddPostComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'update/:id',
        component: AddPostComponent,
        canDeactivate: [unsavedChangesGuard],
        resolve: {
          data: postResolver,
        },
      },
    ],
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    resolve: {
      data: ownerResolver,
    },
    canActivate: [isLoggedInGuard],
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    resolve: {
      user: userResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    canActivate: [isLoggedInGuard],
    canActivateChild: [isLoggedInGuard],
    children: [
      {
        path: '',
        component: PersonalInfoComponent,
      },
      {
        path: 'posts',
        children: [
          {
            path: '',
            component: PostListComponent,
          },
          {
            path: 'shared',
            component: PostListComponent,
            data: { shared: true },
          },
          {
            path: 'liked',
            component: PostListComponent,
            data: { liked: true },
          },
        ],
      },

      {
        path: 'friends',
        component: FriendListComponent,
        resolve: {
          data: friendsResolver,
        },
      },
      {
        path: 'sent-requests',
        component: FriendListComponent,
        resolve: {
          data: friendRequestsResolver,
        },
        data: {
          sent: true,
        },
      },
      {
        path: 'received-requests',
        component: FriendListComponent,
        resolve: {
          data: friendRequestsResolver,
        },
        data: {
          sent: false,
        },
      },
    ],
  },
  {
    path: 'feed',
    component: PostListComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [isLoggedOutGuard],
  },
  {
    path: 'sign-up',
    canActivate: [isLoggedOutGuard],
    component: SignupComponent,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
