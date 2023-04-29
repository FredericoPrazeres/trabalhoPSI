import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ItemService } from '../item.service';
import { Item } from '../item';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  item: Item | undefined;
  name: String | undefined;
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private userService: UserService
  ) {}

  getItem() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name === null) {
      this.userService.routeHere('/');
      return;
    }
    this.itemService.getItem(name).subscribe((item) => (this.item = item));
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
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
        this.user = res;
      });
  }
  addItemToCart() {
    console.log(this.item?.name);
    if (this.item === undefined) {
      return;
    } else {
      this.itemService
        .addItemToUserCart(this.item.name)
        .pipe(
          tap(() => {
            console.log('Item adicionado ao carrinho com sucesso');
          }),
          catchError((error) => {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  addItemToWishlist() {
    if (this.item === undefined) {
      return;
    } else {
      this.itemService
        .addItemToUserWishlist(this.item.name)
        .pipe(
          tap(() => {
            console.log('Item adicionado ao carrinho com sucesso');
          }),
          catchError((error) => {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }
}
