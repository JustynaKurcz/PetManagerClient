import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ToastService } from "../../services/toast/toast.service";
import { HealthRecordsService } from "../../services/health-records/health-records.service";
import { AddAppointmentToHealthRecordCommand } from "../../models/health-records/add-appointment-to-health-record/add-appointment-to-health-record-command";
import {PrimengImports} from "../../constants/primeng-imports";
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...PrimengImports
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent  {
  @Input() healthRecordId!: string;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  appointmentForm!: FormGroup;
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  isLoading: boolean = false;

  readonly calendarLocale = {
    firstDayOfWeek: 1,
    dayNames: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
    dayNamesShort: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
    dayNamesMin: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"],
    monthNames: [ "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
      "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień" ],
    monthNamesShort: [ "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
      "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru" ],
    today: 'Dzisiaj',
    clear: 'Wyczyść',
    dateFormat: 'dd.mm.yy',
  };

  constructor(
    private fb: FormBuilder,
    private healthRecordsService: HealthRecordsService,
    private toastService: ToastService,
    private primeConfig: PrimeNGConfig
  ) {
    this.initializeForm();
    this.primeConfig.setTranslation(this.calendarLocale);
  }

  private initializeForm(): void {
    this.appointmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      diagnosis: [''],
      appointmentDate: [null, Validators.required],
      notes: ['']
    });
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.appointmentForm.reset();
  }

  onDialogHide(): void {
    this.hideDialog();
  }

  onSubmit(): void {
    if (this.appointmentForm.valid && this.healthRecordId) {
      const appointmentData = this.prepareAppointmentData();
      this.createAppointment(appointmentData);
    } else {
      if (!this.healthRecordId) {
        this.toastService.showError('Brak identyfikatora dokumentacji zdrowotnej');
      }
    }
  }

  private prepareAppointmentData(): AddAppointmentToHealthRecordCommand {
    const formValue = this.appointmentForm.value;
    return {
      title: formValue.title.trim(),
      diagnosis: formValue.diagnosis.trim(),
      appointmentDate: formValue.appointmentDate instanceof Date
        ? formValue.appointmentDate.toISOString()
        : formValue.appointmentDate,
      notes: formValue.notes?.trim() || ''
    };
  }

  private createAppointment(appointmentData: AddAppointmentToHealthRecordCommand): void {
    if (!this.healthRecordId) return;

    this.isLoading = true;
    this.healthRecordsService.addAppointmentToHealthRecord(this.healthRecordId, appointmentData)
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Pomyślnie dodano wizytę');
          this.hideDialog();
          window.location.reload();
        },
        error: (error) => {
          console.error('Błąd dodawania wizyty:', error);
          this.toastService.showError('Nie udało się dodać wizyty');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
