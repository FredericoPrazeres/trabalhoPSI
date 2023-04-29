import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError } from 'rxjs';
import { Item } from '../item';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | undefined;
  route: any;

  ufilter: string = '';
  filteredItems: Item[] = [];
  items: Item[] = [];
  showMessage: boolean = false;

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

  logout() {
    this.userService
      .logout()
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      )
      .subscribe((res: any) => {
        console.log(res.message);
        this.currentUser = undefined;
        this.userService.routeHere('/');
      });
  }

  getUserProfile() {
    this.userService.routeHere('/user/' + this.currentUser?.name);
  }

  searchUsers(): void {
    this.userService.routeHere('/user-search');
  }

  pesquisar(): void {
    this.showMessage = false;
    if (this.ufilter.trim().length > 1) {
      this.filteredItems = this.items.filter((i) =>
        i.name.includes(this.ufilter)
      );
      if (this.filteredItems.length == 0) {
        this.showMessage = true;
      }
    }
  }

  goItem(name: string): void {
    this.userService.routeHere('/item/' + name);
  }

  wishlist() {
    this.userService.routeHere('/wishlist/' + this.currentUser?.name);
  }
  removerItem(item:string){
    this.itemService.removeItemWishlist(item);
  }
}
