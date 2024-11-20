import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from '@angular/material/icon';
import {UsersService} from "../../../services/users/users.service";
import {HttpClientModule} from "@angular/common/http";
import {MatIconButton} from "@angular/material/button";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatIconModule,
    HttpClientModule,
    MatIconButton,
    MatSnackBarModule
  ],
  providers: [UsersService],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  public SignInCommand = {
    email: '',
    password: ''
  };

  hidePassword: boolean = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  constructor(public usersService: UsersService, private router: Router, private snackBar: MatSnackBar) {
  }

  signIn() {
    return this.usersService
      .signIn(this.SignInCommand)
      .subscribe({
        next: (result) => {
          if (result) {
            this.router.navigate(['/']);
          } else {
            this.showError();
          }
        },
        error: () => {
          this.showError();
        }
      });
  }

  showError(): void {
    this.SignInCommand = {
      email: '',
      password: ''
    };
    this.snackBar.open('Wystąpił błąd. Podane dane są nieprawidłowe.', 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top', // Ustawienie komunikatu na górze ekranu
      horizontalPosition: 'center' // Wyśrodkowanie komunikatu w poziomie
    });
  }
}
