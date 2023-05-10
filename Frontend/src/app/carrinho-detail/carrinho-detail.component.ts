import { Component, OnInit } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, switchMap, tap} from 'rxjs/operators';
import { UserService } from '../user.service';
import { ItemService } from '../item.service';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-carrinho-detail',
  templateUrl: './carrinho-detail.component.html',
  styleUrls: ['./carrinho-detail.component.css']
})
export class CarrinhoDetailComponent implements OnInit {

  currentUser: User | undefined;

  items: Item[] = [];

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe((resd) => {
      if (resd) {
        this.items = resd;
      }
    });

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

  incItem(citem: string): void {
      this.itemService
        .addItemToUserCart(citem.split('|')[0])
        .pipe(
          tap(() => {
            this.ngOnInit();
          }),
          catchError((error) => {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return of(null);
          })
        )
        .subscribe();
  }

  decItem(citem: string): void {
      this.itemService
        .decItemToUserCart(citem.split('|')[0])
        .pipe(
          tap(() => {
            this.ngOnInit();
          }),
          catchError((error) => {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return of(null);
          })
        )
        .subscribe();
  }
}
