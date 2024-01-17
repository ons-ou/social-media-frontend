import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../auth.service';
import { InputComponent } from '../../../components/input/input.component';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { existingUsernameValidator } from '../../validators/unique-username';
import { UploadImageComponent } from '../../../components/upload-image/upload-image.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    UploadImageComponent,
    ConfirmDialogModule,
    ToastModule,
    RouterModule,
    ButtonModule,
    AsyncPipe,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent{
  authService = inject(AuthService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService)
  fb = inject(FormBuilder);
  router = inject(Router);
  username$: Observable<string>;
  profilePicture: any | undefined;
  form : FormGroup;

  constructor() {
    this.form = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(5)],
        [existingUsernameValidator(this.authService)],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    const firstNameInput = this.form.controls['firstName'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(
        (name) => name !== null && this.form.get('username')!.invalid
      )
    );
    const lastNameInput = this.form.controls['lastName'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(
        (name) => name !== null && this.form.get('username')!.invalid
      )
    );

    this.username$ = combineLatest([firstNameInput, lastNameInput]).pipe(

      switchMap(([firstname, lastname]) =>
        this.authService
          .generateUsername(firstname!, lastname!)
          .pipe(tap((u) => this.form.controls["username"].setValue(u)))
      )
    );
  }

  updatePicture(event: any[]) {
    this.profilePicture = event[0]
  }

  onSubmit() {
    let formData = new FormData();
    Object.keys(this.form.controls).forEach((formControlName) => {
      formData.append(
        formControlName,
        this.form.get(formControlName)?.value
      );
    });

    formData.append('profilePicture', this.profilePicture);

    this.form.reset()
  
    this.authService
      .register(formData)
      .pipe(
        tap(() => this.router.navigate(['/login'])),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          return of(null);
        })
      )
      .subscribe();
  }

}
