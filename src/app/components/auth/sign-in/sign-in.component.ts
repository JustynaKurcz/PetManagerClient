import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UsersService} from '../../../services/users/users.service';
import {SignInCommand} from '../../../models/users/sign-in/sign-in-command';
import {BrandFeaturesComponent} from "../shared/brand-features/brand-features.component";
import {BrandHeaderComponent} from "../shared/brand-header/brand-header.component";
import {FormInputComponent} from "../shared/form-input/form-input.component";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    BrandFeaturesComponent,
    ReactiveFormsModule,
    FormsModule,
    BrandHeaderComponent,
    FormInputComponent
  ],
  providers: [UsersService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  private readonly usersService = inject(UsersService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signIn(): void {
    this.signInForm.markAllAsTouched();

    if (this.signInForm.valid) {
      const signInData: SignInCommand = this.signInForm.value;

      this.usersService.signIn(signInData).subscribe({
        next: () => {
          window.location.href = '/moje-zwierzaki';
        },
        error: () => {
          this.showError();
        },
      });
    } else {
      this.signInForm.markAllAsTouched();
    }
  }

  showError(): void {
    this.signInForm.reset();
    this.snackBar.open(
      'Nieprawidłowy email lub hasło',
      'Zamknij',
      {
        duration: 5000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      }
    );
  }

  onForgotPassword() {
    this.router.navigate(['/resetuj-haslo']);
  }

  navigateToSignUp() {
    this.router.navigate(['/zarejestruj-sie']);
  }
}
