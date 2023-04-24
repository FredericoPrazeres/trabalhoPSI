import { Injectable } from '@angular/core';
import {User} from './user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
      })
    );
  }
  routeHere(path:string){
    this.router.navigate([path]);
  }
}
