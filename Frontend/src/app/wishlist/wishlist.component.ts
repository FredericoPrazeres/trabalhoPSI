import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { Item } from '../item';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  items: Item[] = []; // A lista de itens da wishlist
  itemName!: string;
  user: User | undefined;

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private route: ActivatedRoute,
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
        const name = this.route.snapshot.paramMap.get('name')!;
        this.userService
          .getUser(name)
          .subscribe((res: any) => (this.user = res));
      });
  }

  loadItems() {
    this.wishlistService.getItems().subscribe((items) => {
      this.items = items;
    });
  }

  addItem(itemName: string) {
    this.wishlistService.addItem(itemName).subscribe(() => {
      this.loadItems(), alert('item adicionado com sucesso');
    });
  }

  onSubmit() {
    this.wishlistService.addItem(this.itemName).subscribe(() => {
      this.loadItems(), alert('Item adicionado à wishlist!');
    });
    this.itemName = '';
  }

  removeItem(itemId: string) {
    this.wishlistService.removeItem(itemId).subscribe(() => {
      this.loadItems();
    });
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
  }
}
