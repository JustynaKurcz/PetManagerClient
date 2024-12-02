import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {UsersService} from "../../../services/users/users.service";
import {MaterialImports} from "../../../constants/material-imports";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [...MaterialImports, HttpClientModule, FormsModule, ReactiveFormsModule, NgIf,],
  providers: [UsersService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  signUp() {
    if (this.signUpForm.invalid) {
      return;
    }

    const signUpData = this.signUpForm.value;

    this.usersService.signUp(signUpData).subscribe({
      next: () => {
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        this.showError();
      }
    })
  }

  showError(): void {
    this.signUpForm.reset();

    this.snackBar.open('Wystąpił błąd. Podane dane są nieprawidłowe.', 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}

