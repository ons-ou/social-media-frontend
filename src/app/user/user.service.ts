import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { User } from './models/user';
import { URL } from '../config/constants';
import { FriendRequest } from './models/friendRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = URL;

  constructor(private http: HttpClient) {}

  getAdmin(): Observable<User> {
    const url = `${this.apiUrl}auth/admin`;
    return this.http.get<User>(url);
  }

  getUser(id: string): Observable<User> {
    const url = `${this.apiUrl}users/${id}`;
    return this.http.get<User>(url);
  }

  findRequest(id: string): Observable<FriendRequest> {
    const url = `${this.apiUrl}friend-requests/find/${id}`;
    return this.http.get<FriendRequest>(url);
  }

  getFriends(id: string): Observable<any[]> {
    const url = `${this.apiUrl}users/friends/${id}`;
    return this.http.get<User[]>(url);
  }

  removeFriend(friendId: string): Observable<User> {
    const url = `${this.apiUrl}users/remove-friend/${friendId}`;
    return this.http.delete<User>(url);
  }

  deleteFriendRequest(friendRequestId: string): Observable<void> {
    const url = `${this.apiUrl}friend-requests/delete/${friendRequestId}`;
    return this.http.delete<void>(url);
  }

  acceptFriendRequest(friendRequestId: string): Observable<void> {
    const url = `${this.apiUrl}friend-requests/accept/${friendRequestId}`;
    return this.http.post<void>(url, {});
  }

  sendFriendRequest(id: string): Observable<FriendRequest> {
    const url = `${this.apiUrl}friend-requests/send/${id}`;
    return this.http.post<FriendRequest>(url, {});
  }

  getSentFriendRequests(): Observable<FriendRequest[]> {
    const url = `${this.apiUrl}friend-requests/sent`;
    return this.http.get<FriendRequest[]>(url);
  }

  getReceivedFriendRequests(): Observable<FriendRequest[]> {
    const url = `${this.apiUrl}friend-requests/received`;
    return this.http.get<FriendRequest[]>(url);
  }

  getReceivedFriendRequestsCount(): Observable<string> {
    const url = `${this.apiUrl}friend-requests/received/count`;
    return this.http
      .get<{ message: string }>(url)
      .pipe(map((res) => res.message));
  }

  search(term: string | null): Observable<User[]> {
    if (term == null) return of([]);
    const url = `${this.apiUrl}users/search?term=${term}`;
    return this.http.get<User[]>(url);
  }

  delete(id: string) {
    const url = `${this.apiUrl}auth/${id}`;
    return this.http.delete<any>(url);
  }
}
