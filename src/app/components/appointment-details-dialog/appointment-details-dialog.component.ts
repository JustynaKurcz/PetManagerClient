import {Component, EventEmitter, Input, Output, inject, OnChanges} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DatePipe, NgIf} from "@angular/common";
import {PrimengImports} from "../../constants/primeng-imports";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { HealthRecordsService } from '../../services/health-records/health-records.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-appointment-details-dialog',
  standalone: true,
  imports: [
    DialogModule,
    NgIf,
    DatePipe,
    PrimengImports,
    ReactiveFormsModule
  ],
  templateUrl: './appointment-details-dialog.component.html',
  styleUrl: './appointment-details-dialog.component.css'
})
export class AppointmentDetailsDialogComponent implements OnChanges {
  @Input() appointment: any;
  @Input() visible = false;
  @Input() healthRecordId!: string;
  @Output() visibleChange = new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private healthRecordsService = inject(HealthRecordsService);
  private toastService = inject(ToastService);

  appointmentForm: FormGroup;

  constructor() {
    this.appointmentForm = this.fb.group({
      diagnosis: [''],
      notes: ['']
    });
  }

  ngOnChanges() {
    if (this.appointment) {
      this.appointmentForm.patchValue({
        diagnosis: this.appointment.diagnosis,
        notes: this.appointment.notes
      });
    }
  }

  saveChanges(): void {
    if (this.appointmentForm.valid && this.appointmentForm.dirty) {
      const updateData = this.appointmentForm.value;

      this.healthRecordsService.updateAppointment(
        this.healthRecordId,
        this.appointment.appointmentId,
        updateData
      ).subscribe({
        next: () => {
          this.toastService.showSuccess('Zaktualizowano dane wizyty');
          this.close();
        },
        error: () => {
          this.toastService.showError('Nie udało się zaktualizować danych wizyty');
        }
      });
    }
  }

  close(): void {
    this.appointmentForm.reset();
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
