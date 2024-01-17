import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ThemeService } from '../../services/toggle-theme/theme.service';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { SearchComponent } from '../search/search.component';
import { IconsBarComponent } from '../icons-bar/icons-bar.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    ToggleButtonModule,
    RouterModule,
    FormsModule,
    AvatarModule,
    AsyncPipe,
    SearchComponent,
    IconsBarComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {
  isDark = false;
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  isLoggedIn$: Observable<boolean>;
  user$ = this.authService.user$;
  isLoggedIn = true;

  constructor() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  setTheme() {
    this.isDark = !this.isDark;
    this.themeService.setTheme(this.isDark);
  }
}
