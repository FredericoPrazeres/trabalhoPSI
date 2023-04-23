import { Injectable } from '@angular/core';
import {User} from './user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  allUsers :User[]=[] ;

  constructor(private http : HttpClient, private router:Router) { }
  private serverNodeUrl = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  loginUser(user:User):string {
    try {
      const dbUserObservable: Observable<User> = this.http.get<User>(this.serverNodeUrl+`/user/${user.name}`);
    dbUserObservable.subscribe(dbUser => {
      if (dbUser && dbUser.password === user.password) {
        // User exists in the database and the password matches
        this.router.navigate(['/dashboard'])
        return "Login com sucesso";
      } else {
        // User doesn't exist in the database or the password is incorrect
        return "Login sem sucesso";
      }
    });
    } catch (error) {
      // Handle any database errors
      console.error(error);
      throw new Error('Error occurred while checking user login');
    }
    return "O username ou password estão incorretos.";
  }

}
