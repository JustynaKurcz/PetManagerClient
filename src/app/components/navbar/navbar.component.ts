import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";
import "primeicons/primeicons.css";
import { MegaMenuModule } from "primeng/megamenu";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    MegaMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private jwtHelper = new JwtHelperService();
  items: MenuItem[] | undefined;

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

  ngOnInit() {
    this.items = [
      {
        label: 'Strona główna',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Dodaj zwierzaka',
        icon: 'pi pi-plus',
        routerLink: '/pet/create',
        visible: this.isLoggedIn()
      },
      {
        label: 'Kontakt',
        icon: 'pi pi-envelope'
      },
      {
        label: 'Justyna Kurcz',
        icon: 'pi pi-user',
        visible: this.isLoggedIn(),
        items: [
          {
            label: 'Moje konto',
            icon: 'pi pi-user',
            routerLink: '/account'
          },
          {
            label: 'Wyloguj',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          }
        ]
      }
    ];
  }
}
