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
          console.log('Login successful', response);
          // Navigate to a protected route, e.g., dashboard
          // this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          // Alert the user about the failed login
          alert('Login failed. Please check your credentials and try again.');
        }
      })
  }

}
