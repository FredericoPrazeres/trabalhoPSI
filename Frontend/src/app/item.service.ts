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
  private serverNodeUrl = 'http://localhost:3000/items';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials:true
  };

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.serverNodeUrl);
  }

  getItemById(id: string): Observable<Item> {
    const url = `${this.serverNodeUrl}/${id}`;
    return this.http.get<Item>(url);
  }

  getItemDetailsById(id: string, token: string): Observable<Item> {
    const url = `${this.serverNodeUrl}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get<Item>(url, httpOptions);
  }
}