import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register-screen',
  templateUrl: './register-screen.component.html',
  styleUrls: ['./register-screen.component.css']
})
export class RegisterScreenComponent {

  constructor(private userService:UserService){}
}
