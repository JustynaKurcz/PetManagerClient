import {Component, inject, Input, OnInit} from '@angular/core';
import {Appointment} from '../../models/health-records/appointment';
import {HealthRecordsService} from "../../services/health-records/health-records.service";
import {ConfirmationService} from "primeng/api";
import {ToastService} from "../../services/toast/toast.service";
import {TableModule} from "primeng/table";
import {AppointmentFormComponent} from "../appointment-form/appointment-form.component";
import {DatePipe, NgIf} from "@angular/common";
import {NotificationStatusComponent} from "../notification-status/notification-status.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {AppointmentDetailsDialogComponent} from "../appointment-details-dialog/appointment-details-dialog.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PaginatorComponent} from "../shared/paginator/paginator.component";
import {AppointmentResponse} from "../../models/health-records/browse-appointment/AppointmentResponse";

@Component({
  selector: 'app-appointments-history',
  standalone: true,
  imports: [
    TableModule,
    AppointmentFormComponent,
    NgIf,
    NotificationStatusComponent,
    DatePipe,
    ConfirmDialogModule,
    DialogModule,
    AppointmentDetailsDialogComponent,
    ProgressSpinnerModule,
    PaginatorComponent
  ],
  templateUrl: './appointments-history.component.html',
  styleUrl: './appointments-history.component.css'
})
export class AppointmentsHistoryComponent implements OnInit {
  @Input() healthRecordId!: string;

  private readonly healthRecordsService = inject(HealthRecordsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly toastService = inject(ToastService);

  showDetailsDialog = false;
  selectedAppointment: any = null;

  pageIndex: number = 0;
  pageSize: number = 6;
  totalRecords: number = 0;
  vaccinations: Appointment[] = [];
  isLoading: boolean = false;
  showAppointmentForm = false;

  ngOnInit() {
    this.loadAppointments();
  }

  onPageChange(event: {pageIndex: number, pageSize: number}): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAppointments();
  }

  showDetails(appointmentId: string): void {
    this.showDetailsDialog = true;

    if (!this.healthRecordId) {
      this.toastService.showError('Brak identyfikatora karty zdrowia.');
      return;
    }

    this.healthRecordsService.getAppointmentDetails(this.healthRecordId, appointmentId).subscribe({
      next: (appointment) => {
        this.selectedAppointment = appointment;
        this.showDetailsDialog = true;

      },
      error: () => {
        this.toastService.showError('Nie udało się pobrać szczegółów wizyty.');
      }
    });
  }

  confirmDelete(appointmentId: string): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć tę wizytę?',
      header: 'Potwierdź usunięcie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        this.deleteAppointment(appointmentId);
      }
    });
  }

  deleteAppointment(appointmentId: string): void {
    if (!this.healthRecordId) {
      this.toastService.showError('Brak identyfikatora karty zdrowia.');
      return;
    }

    if (!appointmentId) {
      this.toastService.showError('Brak identyfikatora wizyty.');
      return;
    }

    this.healthRecordsService.deleteAppointment(this.healthRecordId, appointmentId).subscribe({
      next: () => {
        this.toastService.showSuccess('Wizyta została usunięta.');
        this.confirmationService.close();
        this.loadAppointments();
      },
      error: () => {
        this.toastService.showError('Nie udało się usunąć wizyty.');
      }
    });
  }

  private loadAppointments() {
    this.isLoading = true;
    this.healthRecordsService.getAppointments(this.healthRecordId, this.pageIndex, this.pageSize).subscribe({
      next: (response : AppointmentResponse) => {
        this.vaccinations = response.items;
        this.totalRecords = response.totalCount;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.showError('Nie udało się pobrać wizyt.');
        this.isLoading = false;
      }
    });
  }
}
