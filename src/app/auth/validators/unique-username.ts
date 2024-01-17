import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth.service';

export function existingUsernameValidator(
  authService: AuthService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => 
    (authService.checkUsername(control.value).pipe(
      map(() => null),
      catchError(() => of({ notUnique: true }))
    )
  )
}
