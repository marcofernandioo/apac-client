import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private api: HttpClient,
    private authService: DataService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    
  }

  onSubmit(): void {
    this.authService.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          if (response.access_token) {
            // this.authService.setToken(response.access_token);
            const role = this.authService.getUserRole();
            if (role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (role === 'scheduler') {
              this.router.navigate(['/scheduler'])
            } else {
              console.log('invalid');
              this.authService.clearToken();
            }
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          // Alert the user about the failed login
          alert('Login failed. Please check your credentials and try again.');
        }
      })
  }

}
