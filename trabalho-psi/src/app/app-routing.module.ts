import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:'login-screen',component:LoginScreenComponent},
  {path:'dashboard',component:DashboardComponent},
  { path: '', redirectTo: '/login-screen',pathMatch:'full'  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
