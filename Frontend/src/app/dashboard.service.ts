import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http : HttpClient, private router:Router) { }
  private serverNodeUrl = 'http://localhost:3000';

  sessionUsername:String="";


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getSessionName(): Observable<String> {

    return this.http.get(this.serverNodeUrl+'/session',this.httpOptions).pipe(
      map((response: any) => {
        console.log(response.message);
        this.sessionUsername=response.message;
        return this.sessionUsername;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status ===401){
          this.router.navigate(['/']);
          return "";
        }else{
          throw error;
        }
      }
    ));
  }

}
