import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import "primeicons/primeicons.css";
import {MegaMenuModule} from "primeng/megamenu";
import {UsersService} from "../../services/users/users.service";
import {MenuModule} from "primeng/menu";
import {NgForOf} from "@angular/common";
import {Button} from "primeng/button";
import {Subscription} from "rxjs";

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
export class NavbarComponent implements OnInit, OnDestroy {
  userMenuItems: MenuItem[] = [];
  menuItems: MenuItem[] = [];
  private authSubscription?: Subscription;

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
    this.updateUserMenuItems(this.usersService.isLoggedIn());
    this.initializeMenuItem();

    this.authSubscription = this.usersService
      .getAuthState()
      .subscribe(
      (isLoggedIn: boolean) => {
        this.updateUserMenuItems(isLoggedIn);
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription
        .unsubscribe();
    }
  }

  private initializeMenuItem() {
    this.menuItems = [
      {
        label: 'Moje zwierzaki',
        icon: 'pi pi-id-card',
        routerLink: ['/moje-zwierzaki']
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
          command: () => this.logout()
        }
      ];
    } else {
      this.userMenuItems = [
        {
          label: 'Zaloguj się',
          icon: 'pi pi-sign-in',
          routerLink: ['/zaloguj-sie']
        },
        {
          label: 'Zarejestruj się',
          icon: 'pi pi-user-plus',
          routerLink: ['/zarejestruj-sie']
        }
      ];
    }
  }

  async logout() {
    await this.usersService.signOut().then(() => window.location.reload());
  }

}
