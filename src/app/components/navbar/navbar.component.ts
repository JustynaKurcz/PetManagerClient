import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import "primeicons/primeicons.css";
import {MegaMenuModule} from "primeng/megamenu";
import {UsersService} from "../../services/users/users.service";
import {MenuModule} from "primeng/menu";
import {NgForOf} from "@angular/common";
import {Button} from "primeng/button";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    MegaMenuModule,
    MenuModule,
    NgForOf,
    Button,
  ],
  providers: [UsersService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly cdr = inject(ChangeDetectorRef);

  userMenuItems: MenuItem[] | undefined;
  menuItems: MenuItem[] | undefined;

  ngOnInit() {
    this.updateUserMenuItems(this.usersService.isLoggedIn());
    this.initializeMenuItem();

    this.usersService.getAuthState().subscribe(
      (isLoggedIn: boolean) => {
        this.updateUserMenuItems(isLoggedIn);
        this.cdr.detectChanges();
      }
    );
  }

  private initializeMenuItem() {
    this.menuItems = [
      {
        label: 'Strona główna',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Kontakt',
        icon: 'pi pi-envelope'
      }
    ];
  }

  private updateUserMenuItems(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.userMenuItems = [
        {
          label: 'Moje konto',
          icon: 'pi pi-user',
          routerLink: ['/profile']
        },
        {
          separator: true
        },
        {
          label: 'Wyloguj się',
          icon: 'pi pi-sign-out',
          command: () => {
            this.usersService.signOut();
            window.location.reload()
          }
        }
      ];
    } else {
      this.userMenuItems = [
        {
          label: 'Zaloguj się',
          icon: 'pi pi-sign-in',
          routerLink: ['/sign-in']
        },
        {
          label: 'Zarejestruj się',
          icon: 'pi pi-user-plus',
          routerLink: ['/sign-up']
        }
      ];
    }
  }
}
