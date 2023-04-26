import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

  loginMessage:string="";
  currentUser : User | undefined;

  constructor(private userService: UserService){}
  
  ngOnInit(): void {
    this.userService.getCurrentUser()
  .pipe(
    catchError((error: any) => {
      return [];
    })
  )
  .subscribe((user: User) => {
    this.userService.routeHere('/dashboard');
    this.currentUser = user;
  });

  }

  login(name: string, password: string) {
    this.userService.login(name,password).pipe(
      catchError((error:any)=>{
        if(error.status===401){
          this.loginMessage="Username ou password inválida"
          return [];
        }else{
          throw error;
        }
      })
    )
    .subscribe((res:any)=>{
      this.currentUser=res.user;
      this.userService.routeHere('/dashboard');
    })
  }
  
  goRegisterScreen(){
    this.userService.routeHere('/register-screen');
  }
}
