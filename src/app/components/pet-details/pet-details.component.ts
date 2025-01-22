import {Component, OnInit, ViewChild} from '@angular/core';
import {PetDetailsDto} from "../../models/pets/pet-details-dto";
import {PetsService} from "../../services/pets/pets.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HealthRecordsService} from "../../services/health-records/health-records.service";
import {NgIf} from "@angular/common";
import {PrimengImports} from "../../constants/primeng-imports";
import {ConfirmationService} from "primeng/api";
import {AppointmentFormComponent} from "../appointment-form/appointment-form.component";
import {ToastService} from "../../services/toast/toast.service";
import {EditPetFormComponent} from "../edit-pet-form/edit-pet-form.component";
import {VaccinationFormComponent} from "../vaccination-form/vaccination-form.component";
import {PetHeaderComponent} from "../pet-header/pet-header.component";
import {PetInfoCardsComponent} from "../pet-info-cards/pet-info-cards.component";
import {HealthRecordTabComponent} from "../health-record-tab/health-record-tab.component";

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [
    PrimengImports,
    NgIf,
    EditPetFormComponent,
    PetHeaderComponent,
    PetInfoCardsComponent,
    HealthRecordTabComponent
  ],
  providers: [PetsService, ConfirmationService, ToastService, HealthRecordsService],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.css'
})
export class PetDetailsComponent implements OnInit {
  @ViewChild('appointmentForm') appointmentForm?: AppointmentFormComponent;
  @ViewChild('vaccinationForm') vaccinationForm?: VaccinationFormComponent;
  @ViewChild(EditPetFormComponent) editPetForm!: EditPetFormComponent;

  showEditDialog = false;
  isLoading = true;
  pet!: PetDetailsDto;
  pageIndex: number = 1;
  pageSize: number = 5;

  constructor(
    private petsService: PetsService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('petId');
    if (petId) {
      this.loadPetDetails(petId);
    } else {
      this.toastService.showError('Nie odnaleziono zwierzęcia.');
      this.router.navigate(['/moje-zwierzaki']);
    }
  }

  editPet(): void {
    this.showEditDialog = true;
  }

  onPetUpdated(): void {
    this.loadPetDetails(this.pet.petId);
  }

  loadPetDetails(petId: string): void {
    this.petsService.getPetDetails(petId).subscribe({
      next: (response) => {
        this.pet = response;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów zwierzęcia:', error);
        this.toastService.showError('Nie udało się pobrać szczegółów zwierzęcia.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmDeletePet(): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć to zwierzę?',
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        this.petsService.deletePet(this.pet.petId).subscribe({
          next: () => {
            this.toastService.showSuccess('Zwierzę zostało usunięte.');
            this.router.navigate(['/moje-zwierzaki']);
          },
          error: (err) => {
            console.error('Error deleting pet:', err);
            this.toastService.showError('Nie udało się usunąć zwierzęcia.');
          }
        });
      }
    });
  }

  onPhotoUpdated() {
    this.loadPetDetails(this.pet.petId);
  }
}
