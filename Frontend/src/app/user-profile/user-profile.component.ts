import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;
  name: String | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .pipe(
        catchError((error: any) => {
          this.userService.routeHere('/');
          return [];
        })
      )
      .subscribe((res: any) => {
        this.user = res.user;
      });
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
  }
}
