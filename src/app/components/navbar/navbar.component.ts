import {Component, OnInit} from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import "primeicons/primeicons.css";
import {MegaMenuModule} from "primeng/megamenu";
import {UsersService} from "../../services/users/users.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    MegaMenuModule
  ],
  providers:[UsersService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(private usersService: UsersService) {
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/';
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
        visible: this.usersService.isLoggedIn()
      },
      {
        label: 'Kontakt',
        icon: 'pi pi-envelope'
      },
      {
        label: 'Justyna Kurcz',
        icon: 'pi pi-user',
        visible: this.usersService.isLoggedIn(),
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
