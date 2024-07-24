import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
// import { AuthGuard } from './core/guards/auth.guard';

import { LoginComponent } from './pages/login/login.component';

import { TimelineComponent } from './pages/timeline/timeline.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'scheduler',
    component: TimelineComponent
  }
//   { 
//     path: 'home', 
//     loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
//   },
//   { 
//     path: 'auth', 
//     loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
//   },
//   { 
//     path: 'dashboard', 
//     loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
//     canActivate: [AuthGuard] 
//   },
//   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }