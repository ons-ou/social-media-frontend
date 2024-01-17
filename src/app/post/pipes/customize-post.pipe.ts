import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable, map, switchMap, tap } from 'rxjs';
import { Post } from '../models/post';

@Pipe({
  name: 'customizePost',
  standalone: true
})
export class CustomizePostPipe implements PipeTransform {

  constructor(private authService: AuthService) {}

  transform(post$: Observable<Post>): Observable<any> {
    return this.authService.user$.pipe(   
      switchMap(user =>
        post$.pipe(
          map(post => user?.id && ({
            ...post,
            isLiked: post.likedBy.indexOf(user.id) !== -1,
            isShared: post.sharedBy.indexOf(user.id) !== -1,
            isOwner: post.user?.id === user.id,
          }))
        )
      )
    );
  }

}
