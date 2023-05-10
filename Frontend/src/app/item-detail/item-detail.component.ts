import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ItemService } from '../item.service';
import { Item } from '../item';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  item: Item | undefined;
  name: String | undefined;
  user: User | undefined;
  private apiUrl = '127.0.0.1:3058';

  constructor(
    private http: HttpClient,
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


  showItemInfo(){
    var itemInfo = document.getElementById("item-info");
    if(!itemInfo){
      return;
    }

			if (itemInfo.style.display === "none") {
				itemInfo.style.display = "block";
			} else {
				itemInfo.style.display = "none";
			}
  }
  
 submitItemInfo() {
  var itemRating = (<HTMLInputElement>document.querySelector('input[name="item-rating"]:checked')).value;
  var itemReview = (<HTMLInputElement>document.getElementById("item-review")).value;
  var userName = this.user?.name;
  if (typeof userName ==="string"){
    if(typeof this.item?.name ==="string"){
      console.log("USER "+userName);
      console.log("Item name: "+this.item?.name)
      console.log("Item Rating: " + itemRating);
      console.log("Item Review: " + itemReview);
      this.itemService.updateItemRating(this.item?.name,userName,parseInt(itemRating),itemReview);
    }
      
  }
    // do whatever you want with the data here
  }


}
