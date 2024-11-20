import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users/users.service";
import {HttpClientModule} from "@angular/common/http";
import {CurrentUserDetailsDto} from "../../models/users/get-current-user-details/current-user-details-dto";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [HttpClientModule, FormsModule, DatePipe, NgIf],
  providers: [UsersService],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent implements OnInit {
  user?: CurrentUserDetailsDto;
  editableUser: any = null;
  isEditMode: boolean = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.usersService.getDetailsOfTheLoggedUser().subscribe((data) => {
      this.user = data;
      this.editableUser = { ...data }; // Tworzymy kopię dla edycji
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.editableUser = { ...this.user }; // Resetujemy zmiany przy anulowaniu
    }
  }

  saveChanges(): void {
    this.usersService.changeUserInformation(this.editableUser).subscribe(() => {
      this.user = { ...this.editableUser }; // Aktualizujemy dane wyświetlane
      this.isEditMode = false; // Wyłączamy tryb edycji
    });
  }

}
