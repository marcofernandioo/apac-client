import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private dataService: DataService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const token = this.dataService.getToken();
    if (token) {
      const role = this.dataService.getUserRole();
      if (role === 'Admin') {
        // this.router.navigate(['/admin']);
        return true;
      } else if (role === 'scheduler') {
        // this.router.navigate(['/scheduler']);
        return true;
      } else {
        // Invalid role
        this.dataService.clearToken();
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // No token, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
