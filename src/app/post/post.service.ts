import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { URL } from '../config/constants';
import { PageRequest } from './models/pageRequest';
import { Observable, map, switchMap, tap } from 'rxjs';
import { Post } from './models/post';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = URL + 'posts';
  private apiUrlUser = URL + 'users'
  public pageSize = 2;

  getPost(id: string): Observable<Post>{
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createComment(commentDTO: any): Observable<Post> {
    const url = `${this.apiUrl}/comment`;
    return this.http.post<Post>(url, commentDTO);
  }

  getFeedPosts(pageNumber: number, size = this.pageSize) : Observable<PageRequest> {
    return this.authService.user$.pipe(
      switchMap((user) =>
        user?.role == 'USER'
          ? this.getUserPosts(pageNumber, size)
          : this.getAllPosts(pageNumber, size)
      )
    );
  }

  getPosts(id: string, pageNumber: number, size = this.pageSize) : Observable<PageRequest> {
    return this.authService.user$.pipe(
      switchMap((user) =>
        user?.role == 'USER'
          ? this.getPostsForUser(id, pageNumber, size)
          : this.getPostsForAdmin(id, pageNumber, size)
      )
    );
  }

  countLatestPosts(userId: string, date: Date): Observable<number> {
    const url = `${this.apiUrl}/${userId}/count`;
    console.log(date)
    const params = new HttpParams()
      .set('date', new Date(date).toLocaleString());

    return this.http.get<{message: string}>(url, { params }).pipe(
      map((res)=> +res.message)
    );
  }

  getAllPosts(pageNumber: number, size : number = this.pageSize) {
    const url = `${this.apiUrl}/admin/all`;
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', size.toString());
    return this.http.get<PageRequest>(url, { params });
  }

  getPostsForUser(id: string, pageNumber: number, size: number = this.pageSize) {
    const url = `${this.apiUrlUser}/${id}/posts`; 
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', size.toString());
    return this.http.get<PageRequest>(url, { params });
  }

  getPostsForAdmin(id: string, pageNumber: number, size: number = this.pageSize) {
    const url = `${this.apiUrl}/admin/user/${id}`; 
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', size.toString());
    return this.http.get<PageRequest>(url, { params });
  }

  getSharedPosts(id: string, pageNumber: number, size = this.pageSize) {
    const url = `${this.apiUrl}/shared/${id}`;
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', size.toString());
    return this.http.get<PageRequest>(url);
  }

  getLikedPosts(id: string, pageNumber: number = 0, size = this.pageSize) {
    const url = `${this.apiUrl}/liked/${id}`;
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', size.toString());
    return this.http.get<PageRequest>(url, { params });
  }

  //todo: require interceptor
  getUserPosts(pageNumber: number, size = this.pageSize) {
    const url = `${this.apiUrlUser}/all/posts`; 
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', size.toString());
    return this.http.get<PageRequest>(url, { params });
  }

  deletePost(postId: string): Observable<void> {
    const url = `${this.apiUrl}/${postId}`;
    return this.http.delete<void>(url);
  }

  createPost(postDTO: FormData): Observable<Post> {
    const url = `${this.apiUrl}/create`;
    return this.http.post<Post>(url, postDTO);
  }

  updatePost(postId: string, postDTO: FormData): Observable<Post> {
    const url = `${this.apiUrl}/update/${postId}`;
    return this.http.put<Post>(url, postDTO);
  }

  //interceptor to all these!!!
  likePost(postId: string): Observable<Post> {
    const url = `${this.apiUrl}/${postId}/like`;
    return this.http.post<Post>(url, {});
  }

  sharePost(postId: string): Observable<Post> {
    const url = `${this.apiUrl}/${postId}/share`;
    return this.http.post<Post>(url, {});
  }

}
