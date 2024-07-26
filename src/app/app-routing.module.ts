import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { AuthGuardService } from './services/auth-guard.service';

import { LoginComponent } from './pages/login/login.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { InfoComponent } from './pages/info/info.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'scheduler',
    component: TimelineComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: InfoComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }