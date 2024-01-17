import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { Post } from '../../models/post';
import { ImagePipe } from '../../../pipes/image.pipe';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { Observable, Subject, merge, of, switchMap } from 'rxjs';
import { PostService } from '../../post.service';
import { Router, RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { CarouselModule } from 'primeng/carousel';
import { CustomizePostPipe } from '../../pipes/customize-post.pipe';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [
    TagModule,
    RouterModule,
    ConfirmPopupModule,
    ButtonModule,
    GalleriaModule,
    CarouselModule,
    CommonModule,
    AvatarModule,
    CustomizePostPipe,
    ImagePipe,
    PostCommentsComponent,
    DividerModule,
    AsyncPipe,
  ],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css',
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {
  @Input()
  post!: Post;

  post$!: Observable<Post>;

  @Output()
  delete = new EventEmitter<string>();

  likeSubject = new Subject();
  shareSubject = new Subject();
  commentSubject = new Subject<any>();

  postService = inject(PostService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  isShown = false;

  severities = ['success', 'warning', 'error'];

  ngOnInit() {
    this.post$ = merge(
      of(this.post),
      this.likeSubject.pipe(switchMap(() => this.postService.likePost(this.post.id))),
      this.shareSubject.pipe(switchMap(() => this.postService.sharePost(this.post.id))),
      this.commentSubject.pipe(switchMap((c) => this.postService.createComment(c)))
    );
  }

  showComments() {
    this.isShown = !this.isShown;
  }

  deletePost(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete.emit(this.post.id);
      },
    });
  }

  comment(c: string) {
    this.commentSubject.next({
      postId: this.post.id,
      content: c,
    });
  }
}
