import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from './item';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
  
    export class WishlistService {
      private serverNodeUrl = 'http://localhost:3000';
      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
      }
    
      constructor(private http: HttpClient) {}
    
      getItems(): Observable<Item[]> {
        const url = `${this.serverNodeUrl}/wishlist`;
        return this.http.get<Item[]>(url);
      }
    
      addItem(itemName: string): Observable<any> {
        const url = `${this.serverNodeUrl}/wishlist`;
        return this.http.post(url, { itemName });
      }
    
      removeItem(itemId: string): Observable<any> {
        const url = `${this.serverNodeUrl}/wishlist/${itemId}`;
        return this.http.delete(url);
      }
    }
