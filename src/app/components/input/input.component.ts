import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    InputTextModule,
    CommonModule,
    InputGroupAddonModule,
    InputGroupModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input()
  control!: FormControl;

  @Input()
  placeholder!: string;

  @Input()
  icon!: string;

  @Input()
  type!: string

  @Input()
  val: string | null = null

  errorMessage$!: Observable<string | undefined>;

  ngOnInit() {
    if (!this.placeholder) this.placeholder = '';

    this.errorMessage$ = this.control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(() => {
        return this.getErrors()
      }
      )
    )
  }

  getErrors(): string | undefined {
    if (this.control.errors) {
      if (this.control.errors['required']) {
        return 'This field is required.';
      }
      if (this.control.errors['minlength'] !== undefined) {
        return 'Too short.';
      }
      if (this.control.errors['email']) {
        return 'Invalid email.';
      }
      if (this.control.errors['notUnique']) {
        return 'Already exists.';
      }

      return 'Invalid value.';
    }
    return undefined;
  }
}
