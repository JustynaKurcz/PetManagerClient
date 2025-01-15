import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UsersService} from "../../../services/users/users.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormInputComponent} from "../shared/form-input/form-input.component";
import {BrandHeaderComponent} from "../shared/brand-header/brand-header.component";
import {BrandFeaturesComponent} from "../shared/brand-features/brand-features.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    BrandFeaturesComponent,
    BrandHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    FormInputComponent
  ],
  providers: [UsersService],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const resetPasswordData = this.resetPasswordForm.value;

    this.usersService.resetPassword(resetPasswordData).subscribe({
      next: () => {
        this.router.navigate(['/zaloguj-sie']);
      },
      error: (err) => {
        this.showError();
      }
    })
  }

  showError(): void {
    this.resetPasswordForm.reset();

    this.snackBar.open('Wystąpił błąd. Podane dane są nieprawidłowe.', 'Zamknij', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

}

