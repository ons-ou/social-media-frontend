import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Post } from '../../models/post';
import { DataViewModule } from 'primeng/dataview';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostSkeletonComponent } from '../post-skeleton/post-skeleton.component';
import { Observable, BehaviorSubject, switchMap, tap, map, scan, takeUntil, takeWhile, Subject, merge, concatMap, combineLatest, share } from 'rxjs';
import { PostService } from '../../post.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomizePostPipe } from '../../pipes/customize-post.pipe';
import { ActivatedRoute, Data, Params } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    PostItemComponent,
    PostSkeletonComponent,
    AsyncPipe,
    CommonModule,
    DataViewModule,
    ButtonModule, 
    ToastModule,
    CustomizePostPipe
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostListComponent {
  postService = inject(PostService);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute)


  posts$!: Observable<Post[]>;
  pageNumberSubject = new BehaviorSubject<number>(0);
  deleteSubject = new Subject<string>();

  isLoading = true;

  getPostCall(val: number, [data, params]: [Data, Params], size?: number, ){
    const id = params["id"]
    const liked = data["liked"]
    const shared = data["shared"]
    if (id == undefined)
      return this.postService.getFeedPosts(val, size)
    else {
      if (liked) return this.postService.getLikedPosts(id, val, size);  
      if (shared) return this.postService.getSharedPosts(id, val, size);
    }
  return this.postService.getPosts(id, val);
  }

  showPosts([data, params]: [Data, Params]){
    return this.pageNumberSubject.pipe(
      switchMap((val) => this.getPostCall(val, [data, params])
      ),
      tap((res)=> {
        this.isLoading = false
        if (res.last) this.pageNumberSubject.complete()
      }),
      map((res) => res.content),
      scan((acc, res) => {
        return [...acc, ...res];
      })
    );
  }

  deletePost([data$, params$]: [Data, Params]){
    return this.deleteSubject.pipe(
      switchMap((id)=> this.postService.deletePost(id)),
      concatMap(()=> this.getPostCall(0, [data$, params$], this.pageNumberSubject.value * this.postService.pageSize)),
      tap(()=> this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully!' })),
      map((res) => res.content),
    )
  }

  ngOnInit() {

    this.posts$ = combineLatest([this.route.data, this.route.queryParams]).pipe(
      switchMap(([data$, params$])=> merge(this.deletePost([data$, params$]), this.showPosts([data$, params$])))
    )
    
  }

  showMore() {
    this.isLoading = true;
    this.pageNumberSubject.next(this.pageNumberSubject.value + 1);
  }

  delete(id: string){
    this.deleteSubject.next(id)
  }
}
