import { Injectable } from '@angular/core';

import { User } from './user';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];

  constructor(private http: HttpClient, private router: Router) {}
  private serverNodeUrl = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.serverNodeUrl}/login`, this.httpOptions);
  }

  getCurrentUserName(): Observable<string> {
    return this.http
      .get<User>(`${this.serverNodeUrl}/login`, this.httpOptions)
      .pipe(map((user) => user.name));
  }

  registerUser(user: User): Observable<String> {
    return this.http
      .post<User>(this.serverNodeUrl + '/users', user, this.httpOptions)
      .pipe(
        mergeMap((newUser) => {
          if (this.existsUser(newUser.name)) {
            return of('Sucesso');
          } else {
            return of('Internal Server error');
          }
        })
      );
  }

  login(name: string, password: string): Observable<User> {
    const payload = { name, password };
    return this.http.post<User>(
      `${this.serverNodeUrl}/login`,
      payload,
      this.httpOptions
    );
  }

  routeHere(path: string) {
    this.router.navigate([path]);
  }

  existsUser(username: string): Observable<boolean> {
    const dbUserObservable: Observable<User> = this.http.get<User>(
      this.serverNodeUrl + `/user/${username}`
    );
    return dbUserObservable.pipe(
      map((user) => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }

  getUser(name: string): Observable<User> {
    return this.http
      .get<User>(this.serverNodeUrl + '/user/' + name, this.httpOptions)
      .pipe(
        map((user) => {
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.serverNodeUrl}/logout`, this.httpOptions);
  }
}
