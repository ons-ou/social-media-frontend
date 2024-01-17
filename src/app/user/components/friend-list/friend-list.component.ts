import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserResponse } from '../../models/user-response';
import { DataViewModule } from 'primeng/dataview';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [DataViewModule, ProfileHeaderComponent, AsyncPipe],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendListComponent {
  private route = inject(ActivatedRoute);
  friends$: Observable<UserResponse[]> = new Observable();

  ngOnInit() {
    this.friends$ = this.route.data.pipe(
      map((data)=> data["data"])
    )
  }
}
