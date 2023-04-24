import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {

  loginMessage:string="";

  constructor(private userService: UserService){}
  
  login(name:string, password:string){
    this.userService.loginUser({name,password} as User).subscribe(string=>
      this.loginMessage=string);
  }
  goRegisterScreen(){
    this.userService.routeHere('/register-screen');
  }
}
