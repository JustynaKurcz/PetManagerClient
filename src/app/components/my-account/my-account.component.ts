import {Component, OnInit} from '@angular/core';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {PrimengImports} from "../../constants/primeng-imports";
import {NgIf} from "@angular/common";
import {UsersService} from "../../services/users/users.service";
import {CurrentUserDetailsDto} from "../../models/users/get-current-user-details/current-user-details-dto";

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    ReactiveFormsModule,
    ...PrimengImports,
    NgIf
  ],
  providers: [ConfirmationService, MessageService, UsersService],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  userData: CurrentUserDetailsDto = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    lastChangePasswordDate: '',
    createdAt: '',
    role: '',
    petsCount: 0,
  };
  editDialogVisible = false;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private usersService: UsersService
  ) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  get userInitials(): string {
    if (this.userData?.firstName?.trim() && this.userData?.lastName?.trim()) {
      return `${this.userData.firstName.charAt(0)}${this.userData.lastName.charAt(0)}`.toUpperCase();
    }
    return 'PM';
  }



  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.usersService.getDetailsOfTheLoggedUser().subscribe({
      next: (data) => {
          this.userData = {
            ...this.userData,
            ...data,
            firstName: data.firstName?.trim() || '',
            lastName: data.lastName?.trim() || ''
          };
      },
      error: (err) => {
        console.error('Error loading user data:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować danych użytkownika.'
        });
      }
    });
  }

  formatDate(date: string | undefined): string {
    return date ? new Date(date).toLocaleDateString() : 'Nie ustawiono';
  }

  showEditDialog() {
    if (this.userData) {
      this.editForm.patchValue({
        firstName: this.userData.firstName,
        lastName: this.userData.lastName
      });
      this.editDialogVisible = true;
    }
  }

  saveProfileChanges() {
    if (this.editForm.valid && this.userData) {
      const formValue = this.editForm.value;
      this.usersService.changeUserInformation(formValue).subscribe({
        next: () => {
          this.userData = {
            ...this.userData,
            ...formValue
          };
          this.editDialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Dane profilu zostały zaktualizowane'
          });
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się zaktualizować danych profilu.'
          });
        }
      });
    }
  }

  confirmDeleteAccount() {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.',
      accept: () => {
        this.usersService.deleteAccount().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Konto usunięte',
              detail: 'Twoje konto zostało pomyślnie usunięte'
            });
          },
          error: (err) => {
            console.error('Error deleting account:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się usunąć konta.'
            });
          }
        });
      }
    });
  }
}
