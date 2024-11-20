import { Component } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  private jwtHelper = new JwtHelperService();

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }
}
