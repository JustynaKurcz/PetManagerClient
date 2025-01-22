import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ToastService } from "../../services/toast/toast.service";
import { HealthRecordsService } from "../../services/health-records/health-records.service";
import { PrimeNGConfig } from "primeng/api";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PrimengImports} from "../../constants/primeng-imports";

@Component({
  selector: 'app-vaccination-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ProgressSpinnerModule,
    PrimengImports,
  ],
  templateUrl: './vaccination-form.component.html',
  styleUrls: ['./vaccination-form.component.css']
})
export class VaccinationFormComponent {
  @Input() healthRecordId!: string;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  vaccinationForm!: FormGroup;
  today: Date = new Date();
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
    this.vaccinationForm = this.fb.group({
      vaccinationName: ['', [Validators.required, Validators.minLength(2)]],
      vaccinationDate: [null, Validators.required],
      nextVaccinationDate: [null]
    });
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.vaccinationForm.reset();
  }

  private handleVaccinationCreationSuccess(): void {
    this.toastService.showSuccess('Pomyślnie dodano szczepienie');
    this.hideDialog();
    window.location.reload();
  }

  onSubmit(): void {
    if (this.vaccinationForm.valid && this.healthRecordId) {
      const vaccinationData = this.prepareVaccinationData();
      this.createVaccination(vaccinationData);
    } else {
      if (!this.healthRecordId) {
        this.toastService.showError('Brak identyfikatora dokumentacji zdrowotnej');
      }
    }
  }

  private prepareVaccinationData(): any {
    const formValue = this.vaccinationForm.value;
    return {
      vaccinationName: formValue.vaccinationName.trim(),
      vaccinationDate: formValue.vaccinationDate instanceof Date
        ? formValue.vaccinationDate.toISOString()
        : formValue.vaccinationDate,
      nextVaccinationDate: formValue.nextVaccinationDate instanceof Date
        ? formValue.nextVaccinationDate.toISOString()
        : formValue.nextVaccinationDate,
    };
  }

  private createVaccination(vaccinationData: any): void {
    if (!this.healthRecordId) return;

    this.isLoading = true;
    this.healthRecordsService.addVaccinationToHealthRecord(this.healthRecordId, vaccinationData)
      .subscribe({
        next: () => this.handleVaccinationCreationSuccess(),
        error: (error) => {
          this.toastService.showError('Nie udało się dodać szczepienia');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}
