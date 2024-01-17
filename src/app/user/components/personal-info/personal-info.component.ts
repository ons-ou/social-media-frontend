import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { UserResponse } from '../../models/user-response';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [DatePipe, AsyncPipe, CommonModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalInfoComponent {

  user$!: Observable<UserResponse>


  activatedRoute = inject(ActivatedRoute)

  ngOnInit(){
    this.user$ = this.activatedRoute.data.pipe(
      map((res)=> res['user'])
    )
  }
}
