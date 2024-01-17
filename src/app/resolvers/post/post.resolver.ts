import { ResolveFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Post } from '../../post/models/post';
import { inject } from '@angular/core';
import { PostService } from '../../post/post.service';
import { MessageService } from 'primeng/api';

export const postResolver: ResolveFn<Post | null> = (route, state) => {
  const id = route.params['id'];
  let postService = inject(PostService)
  return postService.getPost(id).pipe(
    catchError(
      ()=> of(null)
    )
  );
};
