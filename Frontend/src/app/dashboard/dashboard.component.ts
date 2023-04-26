import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser:User |undefined;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser()
    .pipe(
      catchError((error: any) => {
        this.userService.routeHere('/');
        return [];
      })
    )
    .subscribe((res: any) => {
      this.currentUser = res.user;
    });

  }

  logout(){
    this.userService.logout().pipe(
      catchError((error:any)=>{
        throw error;
      })
    )
    .subscribe((res:any)=>{
      console.log(res.message);
      this.currentUser=undefined;
      this.userService.routeHere('/');
    })
  }
}