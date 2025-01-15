import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
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

// export class NavbarComponent implements OnInit, OnDestroy {
//   userMenuItems: MenuItem[] = [];
//   menuItems: MenuItem[] = [];
//   private subscriptions = new Subscription();
//
//   constructor(private usersService: UsersService) {
//   }
//
//   ngOnInit() {
//     this.setupAuthSubscription();
//     this.initializeMenuItem();
//   }
//
//   ngOnDestroy() {
//     this.subscriptions.unsubscribe();
//   }
//
//   private initializeMenuItem() {
//     this.menuItems = [
//       {
//         label: 'Moje zwierzaki',
//         icon: 'pi pi-id-card',
//         routerLink: ['/moje-zwierzaki']
//       },
//       {
//         label: 'Kontakt',
//         icon: 'pi pi-envelope'
//       }
//     ];
//   }


  private updateUserMenuItems(isLoggedIn: boolean) {
    console.log(isLoggedIn);
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

//
//   private setupAuthSubscription() {
//     this.subscriptions.add(
//       combineLatest([
//         this.usersService.getAuthState(),
//       ]).subscribe(([isLoggedIn]) => {
//         this.updateUserMenuItems(isLoggedIn);
//       })
//     );
//   }
//
