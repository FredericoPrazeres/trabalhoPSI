import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { ItemService } from '../item.service';
import { Item } from '../item';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';

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
    private route :ActivatedRoute,
    private itemService: ItemService,
    private userService: UserService
  ) {}

  getItem(){
    const name = this.route.snapshot.paramMap.get('name');
    if (name===null){
      this.userService.routeHere('/');
      return;
    }
    this.itemService.getItem(name).subscribe(item=>this.item=item);
  }

  ngOnInit(): void {
    this.getItem();
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
