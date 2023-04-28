import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  addItemToUser(item:string){
    const payload = {name:item};
    return this.http.put(`${this.serverNodeUrl}/user/cart/`+item,payload,this.httpOptions);
  }

  
}
