import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterScreenComponent } from './register-screen/register-screen.component';
import { ItemListComponent } from './item-list/item-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { FollowersPageComponent } from './followers-page/followers-page.component';
import { FollowingPageComponent } from './following-page/following-page.component';
import { LibraryComponent } from './library/library.component';
import { CarrinhoDetailComponent } from './carrinho-detail/carrinho-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    DashboardComponent,
    RegisterScreenComponent,
    ItemListComponent,
    UserProfileComponent,
    ItemDetailComponent,
    UserSearchComponent,
    WishlistComponent,
    FollowersPageComponent,
    FollowingPageComponent,
    LibraryComponent,
    CarrinhoDetailComponent,
  ],
  imports: [
    BrowserModule,        
    AppRoutingModule, 
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
