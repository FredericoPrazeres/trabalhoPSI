import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {

  loginMessage:String="";

  constructor(private userService: UserService){}
  
  login(name:string, password:string){
    this.userService.loginUser(name,password).subscribe(string=>{
      this.loginMessage=string;
    }),
      (error:any)=>{
        console.log(error);
        return;
      };
  }
  goRegisterScreen(){
    this.userService.routeHere('/register-screen');
  }
}
