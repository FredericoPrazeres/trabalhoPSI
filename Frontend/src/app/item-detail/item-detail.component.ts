import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { ItemService } from '../item.service';
import { Item } from '../item';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailCompenent implements OnInit {
  item: Item | undefined;
  name: String | undefined;
  user: User | undefined;

  constructor(
    private itemService: ItemService,
    private userService: UserService
  ) {}

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
}
