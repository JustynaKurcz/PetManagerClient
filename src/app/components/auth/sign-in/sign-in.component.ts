import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UsersService} from "../../../services/users/users.service";
import {SignInCommand} from "../../../models/users/sign-in/sign-in-command";
import {MaterialImports} from "../../../constants/material-imports";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [...MaterialImports, RouterLink, ReactiveFormsModule, NgIf],
  providers: [UsersService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    public usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }

    const signInData: SignInCommand = this.signInForm.value;

    this.usersService.signIn(signInData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.showError();
      }
    });
  }

  showError(): void {
    this.signInForm.reset();
    this.snackBar.open('Wystąpił błąd. Podane dane są nieprawidłowe.', 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
