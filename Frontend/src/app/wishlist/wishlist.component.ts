import { Component } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { Item } from '../item';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  items: Item[] = []; // A lista de itens da wishlist
  itemName!: string;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.wishlistService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  addItem(itemName: string) {
    this.wishlistService.addItem(itemName).subscribe(() => {
      this.loadItems(), alert('item adicionado com sucesso');
    });
  }

  onSubmit() {
    this.wishlistService.addItem(this.itemName).subscribe(() => {this.loadItems(),
      alert('Item adicionado à wishlist!');
    });
    this.itemName = '';
  }

  removeItem(itemId: string) {
    this.wishlistService.removeItem(itemId).subscribe(() => {
      this.loadItems();
    });
  }
}