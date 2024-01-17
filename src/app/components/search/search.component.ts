import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../user/user.service';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '../../user/models/user';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ProfileHeaderComponent } from '../../user/components/profile-header/profile-header.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    DataViewModule,
    ProfileHeaderComponent,
    AsyncPipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  form = new FormGroup({ searchTerm: new FormControl('') });
  users$: Observable<User[]>;
  hidden = false;
  inside = false;

  constructor(
    private userService: UserService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.users$ = this.form.controls.searchTerm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term) => this.userService.search(term !== '' ? term : null)),
    );
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('click', () => {
        this.zone.run(() => {
          if (this.form.get('searchTerm')?.value !== '') {
            if (!this.inside) {
              this.hidden = true;
            } else this.hidden = false;
            this.cdr.detectChanges();
            this.inside = false;
          }
        });
      });
    });
  }

  clicked() {
    this.inside = true;
  }
}
