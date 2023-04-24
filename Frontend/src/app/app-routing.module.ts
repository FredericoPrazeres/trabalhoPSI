import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterScreenComponent } from './register-screen/register-screen.component';

const routes: Routes = [
  {path:'login-screen',component:LoginScreenComponent},
  {path:'dashboard',component:DashboardComponent},
  { path: '', redirectTo: '/login-screen',pathMatch:'full'  },
  {path: 'register-screen',component:RegisterScreenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
