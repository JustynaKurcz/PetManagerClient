import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {UsersService} from "../../../services/users/users.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HttpClientModule, FormsModule, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, MatIcon, MatIconButton, MatSnackBarModule],
  providers: [UsersService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  public SignUpCommand = {
    email: '',
    password: ''
  }
  public error: string = '';
  hidePassword: boolean = true;

  constructor(private usersService: UsersService, private router: Router, private snackBar: MatSnackBar) {
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  signUp() {
    this.usersService.signUp(this.SignUpCommand).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.message) {
          this.error = this.translateErrorMessage(error.error.message);
          this.showError();
        } else {
          this.error = 'Wystąpił błąd. Proszę spróbować ponownie.';
          this.showError();
        }
        return throwError(() => new Error(this.error));
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        console.error('Błąd podczas tworzenia usera:', err);
        this.showError();
      }
    })
  }

  translateErrorMessage(message: string): string {
    switch (message) {
      case 'email must be a valid email':
        return 'Email musi być prawidłowy.';
      case 'email is not allowed to be empty':
        return 'Email jest wymagany.';
      case 'password is not allowed to be empty':
        return 'Hasło jest wymagane.';
      case 'email must be unique':
        return 'Email musi być unikalny.';
      default:
        return 'Wystąpił błąd. Proszę spróbować ponownie.';
    }
  }

  showError(): void {
    this.SignUpCommand = {
      email: '',
      password: ''
    };
    this.snackBar.open('Wystąpił błąd. Podane dane są nieprawidłowe.', 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}

