import {Component, EventEmitter, Input, OnChanges, Output, inject} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DatePipe, NgIf} from "@angular/common";
import {VaccinationDto} from "../../models/health-records/VaccinationDto";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { HealthRecordsService } from '../../services/health-records/health-records.service';
import { ToastService } from '../../services/toast/toast.service';
import { PrimeNGConfig } from 'primeng/api';
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-vaccination-details-dialog',
  standalone: true,
  imports: [
    DialogModule,
    DatePipe,
    NgIf,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule
  ],
  templateUrl: './vaccination-details-dialog.component.html',
  styleUrl: './vaccination-details-dialog.component.css'
})
export class VaccinationDetailsDialogComponent implements OnChanges {
  @Input() vaccination!: VaccinationDto;
  @Input() healthRecordId!: string;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private healthRecordsService = inject(HealthRecordsService);
  private toastService = inject(ToastService);

  vaccinationForm: FormGroup;

  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

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

  constructor(private primeConfig: PrimeNGConfig) {
    this.vaccinationForm = this.fb.group({
      nextVaccinationDate: [null, Validators.required]
    });
    this.primeConfig.setTranslation(this.calendarLocale);
  }

  ngOnChanges() {
    if (this.vaccination) {
      this.vaccinationForm.patchValue({
        nextVaccinationDate: this.vaccination.nextVaccinationDate
      });
    }
  }

  saveChanges(): void {
    if (this.vaccinationForm.valid && this.vaccinationForm.dirty) {
      const updateData = {
        nextVaccinationDate: this.vaccinationForm.value.nextVaccinationDate.toISOString()
      };

      this.healthRecordsService.updateVaccination(
        this.healthRecordId,
        this.vaccination.vaccinationId,
        updateData
      ).subscribe({
        next: () => {
          this.toastService.showSuccess('Zaktualizowano datę kolejnego szczepienia');
          this.close();
        },
        error: () => {
          this.toastService.showError('Nie udało się zaktualizować daty');
        }
      });
    }
  }

  close(): void {
    this.vaccinationForm.reset();
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
