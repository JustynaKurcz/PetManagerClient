import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { HealthRecordsService } from '../../services/health-records/health-records.service';
import {ConfirmationService} from "primeng/api";
import {ToastService} from "../../services/toast/toast.service";
import {Vaccination} from "../../models/health-records/vaccination";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {NotificationStatusComponent} from "../notification-status/notification-status.component";
import {VaccinationFormComponent} from "../vaccination-form/vaccination-form.component";
import {NgIf} from "@angular/common";
import {VaccinationDto} from "../../models/health-records/VaccinationDto";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {VaccinationDetailsDialogComponent} from "../vaccination-details-dialog/vaccination-details-dialog.component";
import {PaginatorComponent} from "../shared/paginator/paginator.component";
import {VaccinationResponse} from "../../models/health-records/browse-vaccination/VaccinationResponse";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-vaccinations-history',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    NotificationStatusComponent,
    VaccinationFormComponent,
    NgIf,
    ConfirmDialogModule,
    VaccinationDetailsDialogComponent,
    PaginatorComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './vaccinations-history.component.html',
  styleUrl: './vaccinations-history.component.css'
})
export class VaccinationsHistoryComponent implements OnInit {
  @Input() healthRecordId!: string;

  private readonly healthRecordsService = inject(HealthRecordsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly toastService = inject(ToastService);

  showCreateDialog = false;
  showDetailsDialog = false;
  selectedVaccination: any = null;

  pageIndex: number = 0;
  pageSize: number = 6;
  totalRecords: number = 0;
  vaccinations: Vaccination[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.loadVaccinations();
  }

  loadVaccinations(): void {
    if (!this.healthRecordId) {
      this.toastService.showError('Brak identyfikatora karty zdrowia.');
      return;
    }

    this.healthRecordsService.getVaccinations(this.healthRecordId, this.pageIndex + 1, this.pageSize).subscribe({
      next: (response : VaccinationResponse) => {
        this.vaccinations = response.items;
        this.totalRecords = response.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczepień:', error);
        this.isLoading = false;
        this.toastService.showError('Nie udało się pobrać szczepień.');
      }
    });
  }

  onPageChange(event: {pageIndex: number, pageSize: number}): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVaccinations();
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

  confirmDelete(vaccinationId: string): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć to szczepienie?',
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        this.deleteVaccination(vaccinationId);
      }
    });
  }

  deleteVaccination(vaccinationId: string): void {
    if (!this.healthRecordId) {
      this.toastService.showError('Brak identyfikatora karty zdrowia.');
      return;
    }

    if (!vaccinationId) {
      this.toastService.showError('Brak identyfikatora szczepienia.');
      return;
    }

    this.healthRecordsService.deleteVaccination(this.healthRecordId, vaccinationId).subscribe({
      next: () => {
        this.toastService.showSuccess('Szczepienie zostało usunięte.');
        this.confirmationService.close();
        this.loadVaccinations();
      },
      error: (error) => {
        console.error('Błąd podczas usuwania szczepienia:', error);
        this.toastService.showError('Nie udało się usunąć szczepienia.');
      }
    });
  }

  showDetails(vaccinationId: string): void {
    this.showDetailsDialog = true;
    if (!this.healthRecordId) {
      this.toastService.showError('Brak identyfikatora karty zdrowia.');
      return;
    }

    this.healthRecordsService.getVaccinationDetails(this.healthRecordId, vaccinationId).subscribe({
      next: (vaccination : VaccinationDto) => {
        this.selectedVaccination = vaccination;
        this.showDetailsDialog = true;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów szczepienia:', error);
        this.toastService.showError('Nie udało się pobrać szczegółów szczepienia.');
      }
    });
  }
}
