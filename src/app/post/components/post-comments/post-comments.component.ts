import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Comment } from '../../models/comment';
import { ImagePipe } from '../../../pipes/image.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-comments',
  standalone: true,
  imports: [
    InputTextModule,
    ImagePipe,
    DatePipe,
    AvatarModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCommentsComponent {
  @Input()
  comments!: Comment[];

  @Output()
  updateComments = new EventEmitter<string>();

  comment = '';

  addComment() {
    this.updateComments.emit(this.comment)
    this.comment = ''
  }
}
