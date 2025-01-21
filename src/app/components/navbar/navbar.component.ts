import {ChangeDetectorRef, Component, HostListener, inject, OnInit} from '@angular/core';
import {UsersService} from "../../services/users/users.service";
import {NgForOf, NgIf} from "@angular/common";
import {PrimengImports} from "../../constants/primeng-imports";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ...PrimengImports
  ],
  providers: [UsersService],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly cdr = inject(ChangeDetectorRef);
  private isAdmin = this.usersService.isAdmin();

  userMenuItems: MenuItem[] | undefined;
  menuItems: MenuItem[] | undefined;

  isDropdownOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    if (!dropdown) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


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
        label: 'O aplikacji',
        icon: 'pi pi-info-circle',
        routerLink: ['/o-aplikacji']
      },
      {
        label: 'Kontakt',
        icon: 'pi pi-envelope',
        routerLink: ['/kontakt']
      }
    ];

    this.isAdmin.subscribe(isAdmin => {
      if (isAdmin) {
        this.menuItems = [
          ...this.menuItems!,
          {
            label: 'Panel administratora',
            icon: 'pi pi-cog',
            routerLink: ['/panel-administratora']
          }
        ];
        this.cdr.detectChanges();
      }
    });
  }

  private updateUserMenuItems(isLoggedIn: boolean) {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      this.userMenuItems = [
        {
          label: 'Moje konto',
          icon: 'pi pi-user',
          routerLink: ['/moje-konto']
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

  handleItemClick(item: MenuItem, event: MouseEvent) {
    if (item.command) {
      item.command({originalEvent: event, item});
    }
  }

  async logout() {
    await this.usersService.signOut().then(() => window.location.reload());
  }
}
