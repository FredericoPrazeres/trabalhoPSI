import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;
  name: String | undefined;
  

  constructor(private userService: UserService, private router: Router,private route: ActivatedRoute) {}

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
        const name=this.route.snapshot.paramMap.get('name')!;
        this.userService.getUser(name).subscribe(res=>this.user=res);
      });
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
  }

  goToItem(item: String) {
    this.userService.routeHere('/item/' + item);
  }
}
