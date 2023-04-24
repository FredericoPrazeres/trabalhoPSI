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
  
  


  loginUser(user:User):Observable<string> {
    const dbUserObservable: Observable<User> = this.http.get<User>(this.serverNodeUrl+`/user/${user.name}`);
    return dbUserObservable.pipe(
      map(dbUser => {
        if (dbUser && dbUser.password === user.password) {
          // User exists in the database and the password matches
          this.router.navigate(['/dashboard']);
          return "";
        } else {
          // User doesn't exist in the database or the password is incorrect
          return 'Username ou password inválida!';
        }
      
      }),
       catchError(error => {
      if (error.status === 404) {
        // handle 404 error
        return of('Esse utilizador não existe, registe-se!');
      } else {
        // handle other errors
        return of('An error occurred');
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



