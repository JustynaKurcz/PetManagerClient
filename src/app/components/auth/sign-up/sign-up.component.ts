import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {UsersService} from "../../../services/users/users.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormInputComponent} from "../shared/form-input/form-input.component";
import {BrandHeaderComponent} from "../shared/brand-header/brand-header.component";
import {BrandFeaturesComponent} from "../shared/brand-features/brand-features.component";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HttpClientModule, FormsModule, ReactiveFormsModule, BrandFeaturesComponent, BrandHeaderComponent, FormInputComponent, RouterLink],
  providers: [UsersService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

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

  signUp() {
    if (this.signUpForm.invalid) {
      return;
    }

    const signUpData = this.signUpForm.value;

    this.usersService.signUp(signUpData).subscribe({
      next: () => {
        this.router.navigate(['/zaloguj-sie']);
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

