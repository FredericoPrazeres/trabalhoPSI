import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterScreenComponent } from './register-screen/register-screen.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ItemDetailCompenent } from './item-detail/item-detail.component';
import { UserSearchComponent } from './user-search/user-search.component';

const routes: Routes = [
  { path: 'login-screen', component: LoginScreenComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login-screen', pathMatch: 'full' },
  { path: 'register-screen', component: RegisterScreenComponent },
  { path: 'user/:name', component: UserProfileComponent },
  { path: 'item/:name', component: ItemDetailCompenent },
  { path: 'user-search', component: UserSearchComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
