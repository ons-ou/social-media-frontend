import { CanDeactivateFn } from '@angular/router';
import { AddPostComponent } from '../../post/components/add-post/add-post.component';
import { SignupComponent } from '../../auth/components/signup/signup.component';

export const unsavedChangesGuard: CanDeactivateFn<
  AddPostComponent | SignupComponent
> = (
  component: SignupComponent | AddPostComponent,
) => {
  let confirmationService = component.confirmationService;
  if (component.form?.dirty) {
    return new Promise(resolve => confirmationService.confirm({
      message: 'You have unsaved changes. Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        resolve(true)
      },
      reject: () => {
        resolve(false)
      },
    }));

  }
  return true;
};
