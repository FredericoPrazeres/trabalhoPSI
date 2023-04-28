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
  currentUser: User | undefined;
  name: String | undefined;
  user:User|undefined;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userName =this.route.snapshot.paramMap.get('name')!;
    this.userService.getUser(userName).subscribe(res=>this.user=res);

    this.userService
      .getCurrentUser()
      .pipe(
        catchError((error: any) => {
          this.userService.routeHere('/');
          return [];
        })
      )
      .subscribe((res: any) => {
        this.currentUser = res;
      });
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
  }

  goToItem(item: String) {
    this.userService.routeHere('/item/' + item);
  }

  goToWishlist() {
    this.userService.routeHere('/wishlist/'+this.user?.name);
  }
}
