import {Component, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";
import {AccordionModule} from "primeng/accordion";
import {TableModule} from "primeng/table";
import {PetDetailsDto} from "../../models/pets/pet-details-dto";
import {PetsService} from "../../services/pets/pets.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HealthRecordsService} from "../../services/health-records/health-records.service";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {TabViewModule} from "primeng/tabview";
import {BadgeModule} from "primeng/badge";
import {DividerModule} from "primeng/divider";
import {ChipModule} from "primeng/chip";
import {TimelineModule} from "primeng/timeline";
import {TagModule} from "primeng/tag";
import {AvatarModule} from "primeng/avatar";
import {PrimengImports} from "../../constants/primeng-imports";
import {Vaccination} from "../../models/health-records/vaccination";
import {Appointment} from "../../models/health-records/appointment";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-pet-details',
  standalone: true,
  imports: [
    CardModule,
    AccordionModule,
    TableModule,
    DatePipe,
    TabViewModule,
    BadgeModule,
    DividerModule,
    ChipModule,
    TimelineModule,
    TagModule,
    AvatarModule,
    PrimengImports,
    NgClass,
    NgIf,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [PetsService, ConfirmationService, MessageService, HealthRecordsService],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.css'
})
export class PetDetailsComponent implements OnInit {
  pet!: PetDetailsDto;
  vaccinations: Vaccination[] = [];
  appointments: Appointment[] = [];
  pageIndex: number = 1;
  pageSize: number = 5;

  selectedAppointment: any = null;
  showAppointmentDetails: boolean = false;
  selectedVaccination: any = null;
  showVaccinationDetails: boolean = false;

  constructor(
    private petsService: PetsService,
    private healthRecordsService: HealthRecordsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('petId');
    if (petId) {
      this.loadPetDetails(petId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Nie znaleziono zwierzaka.'
      });
      this.router.navigate(['/moje-zwierzaki']);
    }
  }

  loadPetDetails(petId: string): void {
    this.petsService.getPetDetails(petId).subscribe({
      next: (response) => {
        this.pet = response;
        if (response.healthRecordId) {
          this.loadHealthRecords(response.healthRecordId);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Brak karty zdrowia dla zwierzęcia.'
          });
        }
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów zwierzęcia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać szczegółów zwierzęcia.'
        });
      }
    });
  }

  loadHealthRecords(healthRecordId: string): void {
    this.healthRecordsService.getVaccinations(healthRecordId, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.vaccinations = response.items;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczepień:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać listy szczepień.'
        });
      }
    });

    this.healthRecordsService.getAppointments(healthRecordId, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.appointments = response.items;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania wizyt:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać listy wizyt.'
        });
      }
    });
  }


  getVaccinationStatus(nextDate: string): 'success' | 'warning' | 'danger' {
    const today = new Date();
    const nextVaccinationDate = new Date(nextDate);
    const diffTime = nextVaccinationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'danger';
    } else if (diffDays <= 30) {
      return 'warning';
    }
    return 'success';
  }

  getVaccinationStatusLabel(nextDate: string): string {
    const status = this.getVaccinationStatus(nextDate);
    switch (status) {
      case 'danger':
        return 'Przeterminowane';
      case 'warning':
        return 'Wkrótce';
      case 'success':
        return 'Aktualne';
      default:
        return 'Aktualne';
    }
  }

  deleteVaccination(vaccinationId: string): void {
    if (!this.pet?.healthRecordId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Brak identyfikatora karty zdrowia.'
      });
      return;
    }

    if (!vaccinationId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Brak identyfikatora szczepienia.'
      });
      return;
    }

    this.healthRecordsService.deleteVaccination(this.pet.healthRecordId, vaccinationId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Szczepienie zostało usunięte.'
        });
        this.loadHealthRecords(this.pet.healthRecordId);
      },
      error: (error) => {
        console.error('Błąd podczas usuwania szczepienia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się usunąć szczepienia.'
        });
      }
    });
  }

  deleteAppointment(appointmentId: string): void {
    if (!this.pet?.healthRecordId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Brak identyfikatora karty zdrowia.'
      });
      return;
    }

    if (!appointmentId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Brak identyfikatora wizyty.'
      });
      return;
    }

    this.healthRecordsService.deleteAppointment(this.pet.healthRecordId, appointmentId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Wizyta została usunięta.'
        });
        this.loadHealthRecords(this.pet.healthRecordId);
      },
      error: (error) => {
        console.error('Błąd podczas usuwania wizyty:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się usunąć wizyty.'
        });
      }
    });
  }

  editPet(): void {
  }

  confirmDeletePet(): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć to zwierzę?',
      accept: () => {
        this.petsService.deletePet(this.pet.petId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Zwierzę zostało pomyślnie usunięte'
            });
            this.router.navigate(['/moje-zwierzaki']);
          },
          error: (err) => {
            console.error('Error deleting pet:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się usunąć zwierzęcia.'
            });
          }
        });
      }
    });
  }


  confirmDeleteVaccination(vaccinationId: string): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć to szczepienie?',
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteVaccination(vaccinationId);
      }
    });
  }

  confirmDeleteAppointment(appointmentId: string): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć tę wizytę?',
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAppointment(appointmentId);
      }
    });
  }

  showAppointmentDialog(appointmentId: string): void {
    if (!this.pet?.healthRecordId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Brak identyfikatora karty zdrowia.'
      });
      return;
    }

    this.healthRecordsService.getAppointmentDetails(this.pet.healthRecordId, appointmentId).subscribe({
      next: (appointment) => {
        this.selectedAppointment = appointment;
        this.showAppointmentDetails = true;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów wizyty:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać szczegółów wizyty.'
        });
      }
    });
  }

  showVaccinationDialog(vaccinationId: string): void {
    if (!this.pet?.healthRecordId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Brak identyfikatora karty zdrowia.'
      });
      return;
    }

    this.healthRecordsService.getVaccinationDetails(this.pet.healthRecordId, vaccinationId).subscribe({
      next: (vaccination) => {
        this.selectedVaccination = vaccination;
        this.showVaccinationDetails = true;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów szczepienia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się pobrać szczegółów szczepienia.'
        });
      }
    });
  }


}
