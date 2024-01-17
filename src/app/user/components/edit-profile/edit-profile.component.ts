import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../../components/input/input.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImagePipe } from '../../../pipes/image.pipe';
import { AuthService } from '../../../auth/auth.service';
import { catchError, of, tap } from 'rxjs';
import { User } from '../../models/user';
import { UploadImageComponent } from '../../../components/upload-image/upload-image.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ButtonModule,
    InputComponent,
    FileUploadModule,
    RouterModule,
    ReactiveFormsModule,
    ToastModule,
    UploadImageComponent,
  ],
  providers: [MessageService],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileComponent {
  authService = inject(AuthService);
  route = inject(ActivatedRoute)
  router = inject(Router);
  messageService = inject(MessageService);

  form = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    dateOfBirth: new FormControl("", Validators.required),
    oldPassword: new FormControl("", Validators.required),
    newPassword: new FormControl(""),
  });

  submitted = false;
  profileImage: any;
  oldImage: File | null
  text = '';
  user: User

  constructor() {
    this.user = this.route.snapshot.data['data'];
    this.oldImage = this.user.profilePicture
    this.form.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      dateOfBirth: this.user.dateOfBirth.toLocaleString(),
      email: this.user.email,
      oldPassword: "",
      newPassword: ""
    })
  }


  newImages(event: any) {
    this.profileImage = event[0]
  }

  updateExisting() {
    this.oldImage = null
  }

  onSubmit() {
    let formData: any = new FormData();
    Object.keys(this.form.controls).forEach((formControlName) => {
      formData.append(
        formControlName,
        this.form.get(formControlName)?.value
      );
    });

    formData.append('profilePicture', this.profileImage);
    formData.append('oldImage', this.oldImage);

    this.authService
      .updateAccount(formData)
      .pipe(
        tap(() => {
          this.router.navigate(['/feed'])
          this.form.reset();
        }),
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
