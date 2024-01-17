import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { UserResponse } from '../../models/user-response';
import { AvatarModule } from 'primeng/avatar';
import { ImagePipe } from '../../../pipes/image.pipe';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subject, map, merge, of, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
  imports: [
    AvatarModule,
    CommonModule,
    RouterModule,
    ImagePipe,
    AsyncPipe,
    ProfileButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  @Input()
  user!: UserResponse;

  @Input()
  showButton = true;

  @Input()
  iconSize: 'normal' | 'large' | 'xlarge' = 'xlarge';
  @Input()
  textSize = '3xl';

  @Output()
  updateItems = new EventEmitter<string>();

  update(event: string) {
    this.updateItems.emit(event);
  }
}
