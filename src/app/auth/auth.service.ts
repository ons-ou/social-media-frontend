import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { URL } from '../config/constants';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { LoginDTO } from './dtos/loginDTO';
import { UserCredentials } from './dtos/userCredentials';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../user/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);
  private apiUrl = URL + 'auth';
  private router = inject(Router);
  private userSubject = new BehaviorSubject<UserCredentials | null>(null);
  public isLoggedIn$: Observable<boolean>;
  public isLoggedOut$: Observable<boolean>;

  private tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    console.log(expiry);
    console.log(new Date().getTime());
    return Math.floor(new Date().getTime()) >= expiry;
  }

  constructor() {
    this.isLoggedIn$ = this.user$.pipe(map((u) => u != null));

    this.isLoggedOut$ = this.user$.pipe(map((u) => u == null));

    let u = this.cookieService.get('user');
    if (u) {
      let user: UserCredentials = JSON.parse(u);
      //!this.tokenExpired(user.token)?
      this.userSubject.next(user);
      //:this.cookieService.delete('user')
    } else this.userSubject.next(null);
  }

  get user$(): Observable<UserCredentials | null> {
    return this.userSubject.asObservable();
  }

  generateUsername(firstName: string, lastName: string): Observable<string> {
    const name = (
      firstName.replace('\\s+', '') +
      '.' +
      lastName.replace('\\s+', '')
    ).toLocaleLowerCase();
    const url = `${this.apiUrl}/get-username?name=${name}`;
    return this.http
      .get<{ message: string }>(url)
      .pipe(map((res) => res.message));
  }

  checkUsername(name: string): Observable<string> {
    const url = `${this.apiUrl}/check-username?name=${name}`;
    return this.http
      .get<{ message: string }>(url)
      .pipe(map((res) => res.message));
  }

  register(request: FormData): Observable<{ token: string }> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<{ token: string }>(url, request);
  }

  login(request: LoginDTO): Observable<{ token: string }> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<{ token: string }>(url, request).pipe(
      tap((res) => {
        this.handleAuth(res.token);
      })
    );
  }

  logout() {
    this.cookieService.delete('user');
    this.router.navigate(['/']);
    this.userSubject.next(null);
  }

  updateAccount(request: FormData): Observable<{ token: string }> {
    const url = `${this.apiUrl}/update-account`;
    return this.http.post<{ token: string }>(url, request);
  }

  handleAuth(token: string) {
    const creds = JSON.parse(atob(token.split('.')[1])) as UserCredentials;
    this.cookieService.set('user', JSON.stringify({ ...creds, token: token }));
    this.userSubject.next(creds);
  }
}
