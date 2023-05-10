import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError } from 'rxjs';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  username: string | null = null;
  route: any;

  ufilter: string = '';
  filteredItems: Item[] = [];
  items: Item[] = [];
  showMessage: boolean = false;

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {
    this.getUserFromLocalStorage();
  }

  async getUserFromLocalStorage() {
    const storedUser = await localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      if (this.currentUser && this.currentUser.name) {
        this.updateUsername(this.currentUser);
        // Atualize o BehaviorSubject no UserService com o usuário obtido do localStorage
        this.userService.setCurrentUser(this.currentUser);
      } else {
        this.username = null;
        console.log('Nome do usuário não encontrado no localStorage');
      }
    }
  }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe((resd) => {
      if (resd) {
        this.items = resd;
      }
    });

    this.userService.currentUser$.subscribe((user) => {
      this.updateUsername(user);
      console.log(user?.name);

      this.currentUser = user;

      if (user && user.name) {
        // Adicione esta verificação
        // Armazene o usuário no localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // Remova o usuário do localStorage
        localStorage.removeItem('currentUser');
      }
    });
  }

  updateUsername(user: User | null): void {
    if (user) {
      this.username = user.name;
    } else {
      this.username = null;
    }
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
        this.username = null;

        localStorage.removeItem('currentUser'); // Remova o usuário do localStorage
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
    this.userService.routeHere('/wishlist/' + this.username);
  }

  removerItem(itemName: string) {
    this.currentUser!.wishlist = this.currentUser?.wishlist.filter(
      (item) => item !== itemName
    )!;
    this.itemService.removeItemWishlist(itemName);
  }
  gotoUserProfile(name: string) {
    this.userService.routeHere(`user/${name}`);
  }

  openCarrinho(): void {
    this.userService.routeHere(`carrinho`);
    console.log('this.userService.routeHere(`carrinho`);');
  }
}
