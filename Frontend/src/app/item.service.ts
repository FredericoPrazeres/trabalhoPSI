import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, catchError, take } from 'rxjs';
import { Router } from '@angular/router';
import { Item } from './item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient, private router: Router) {}
  private serverNodeUrl = 'http://localhost:3058';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.serverNodeUrl + '/items');
  }

  getItemById(id: string): Observable<Item> {
    const url = `${this.serverNodeUrl}/items${id}`;
    return this.http.get<Item>(url);
  }

  getItemDetailsById(id: string, token: string): Observable<Item> {
    const url = `${this.serverNodeUrl}/items${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get<Item>(url, httpOptions);
  }

  getItem(name: String): Observable<Item> {
    return this.http.get<Item>(
      `${this.serverNodeUrl}/item/` + name,
      this.httpOptions
    );
  }
  addItemToUserCart(item: string) {
    const payload = { itemName: item }; // Modifique esta linha se necessário
    return this.http.put(
      `${this.serverNodeUrl}/user/cart/` + item,
      payload,
      this.httpOptions
    );
  }

  addItemToUserWishlist(item: string) {
    const payload = { name: item }; // Modifique esta linha se necessário
    return this.http.put(
      `${this.serverNodeUrl}/user/wishlist/` + item,
      payload,
      this.httpOptions
    );
  }

  async removeItemWishlist(item: string) {
    try {
      await this.http
        .delete(`${this.serverNodeUrl}/user/wishlist/` + item, this.httpOptions)
        .pipe(take(1), catchError((err) => {
          console.error('Error removing item from wishlist:', err);
          return EMPTY;
        }))
        .toPromise();
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  }
}
