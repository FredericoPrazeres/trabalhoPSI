import { Injectable } from '@angular/core';
import {User} from './user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, flatMap, map, mergeMap, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn:'root'
})
export class UserService {
  allUsers :User[]=[] ;

  constructor(private http : HttpClient, private router:Router) { }
  private serverNodeUrl = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  registerUser(user: User): Observable<String> {
    return this.http.post<User>(this.serverNodeUrl+"/users", user, this.httpOptions).pipe(
      mergeMap(newUser => {
        if (this.existsUser(newUser.name)) {
          return of("Sucesso");
        } else {
          return of("Internal Server error");
        }
      })
    );
  }
  
  


  loginUser(name: string, password: string): Observable<string> {
    const credentials = { name, password };
    return this.http.post(this.serverNodeUrl+'/login', credentials).pipe(
      map((response: any) => {
        const message = response.message; // assuming the server sends the message in the 'message' field
        if (message === "Logged in") {
          this.router.navigate(['/dashboard']);
          return message;
        }
      })
    );
  }
  routeHere(path:string){
    this.router.navigate([path]);
  }

  existsUser(username:string):Observable<boolean> {
    const dbUserObservable: Observable<User> = this.http.get<User>(this.serverNodeUrl+`/user/${username}`);
    return dbUserObservable.pipe(
      map(user => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }
}



