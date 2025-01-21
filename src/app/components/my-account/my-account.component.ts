import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/api";
import {PrimengImports} from "../../constants/primeng-imports";
import {UsersService} from "../../services/users/users.service";
import {CurrentUserDetailsDto} from "../../models/users/get-current-user-details/current-user-details-dto";
import {BreadcrumbItemComponent} from "../shared/breadcrumb-item/breadcrumb-item.component";
import {ToastService} from "../../services/toast/toast.service";
import {EditProfileFormComponent} from "../edit-profile-form/edit-profile-form.component";

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...PrimengImports,
    BreadcrumbItemComponent,
    EditProfileFormComponent
  ],
  providers: [ToastService, ConfirmationService, UsersService],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  @ViewChild(EditProfileFormComponent) editProfileForm!: EditProfileFormComponent;
  userData!: CurrentUserDetailsDto;
  editDialogVisible = false;
  editForm: FormGroup;

  breadcrumbItems = [
    {label: 'Strona główna', link: '/', icon: 'pi pi-home'},
    {label: 'Moje konto', link: '/moje-konto'}
  ];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private usersService: UsersService,
    private toastService: ToastService
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
        this.toastService.showError('Nie udało się załadować danych użytkownika.');
      }
    });
  }

  formatDate(date: string | undefined): string {
    return date ? new Date(date).toLocaleDateString() : '-';
  }

  confirmDeleteAccount() {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.',
      accept: () => {
        this.usersService.deleteAccount().subscribe({
          next: () => {
            this.toastService.showSuccess('Twoje konto zostało pomyślnie usunięte');
            setTimeout(() => this.logout(), 1500);
          },
          error: (err) => {
            console.error('Error deleting account:', err);
            this.toastService.showError('Nie udało się usunąć konta.');
          }
        });
      }
    });
  }

  showEditDialog() {
    if (this.userData && this.editProfileForm) {
      this.editProfileForm.setFormValues(
        this.userData.firstName || '',
        this.userData.lastName || ''
      );
      this.editDialogVisible = true;
    }
  }

  saveProfileChanges(formData: {firstName: string, lastName: string}) {
    this.usersService.changeUserInformation(formData).subscribe({
      next: () => {
        this.userData = {
          ...this.userData,
          ...formData
        };
        this.toastService.showSuccess('Dane profilu zostały zaktualizowane');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.toastService.showError('Nie udało się zaktualizować danych profilu.');
      }
    });
  }

  async logout() {
    await this.usersService.signOut().then(() => window.location.reload());
  }
}
