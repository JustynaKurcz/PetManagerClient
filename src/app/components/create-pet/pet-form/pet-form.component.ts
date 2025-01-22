import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PrimengImports} from "../../../constants/primeng-imports";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PetsService} from "../../../services/pets/pets.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {ImageUploadComponent} from "../image-upload/image-upload.component";
import {CreatePetDto} from "../../../models/pets/create-pet-dto";

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...PrimengImports,
    ImageUploadComponent
  ],
  providers: [PetsService],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.css'
})
export class PetFormComponent implements OnInit {
  @Output() petAdded = new EventEmitter<void>();
  visible: boolean = false;
  petForm!: FormGroup;
  today: Date = new Date();
  genders: { id: number, name: string }[] = [];
  species: { id: number, name: string }[] = [];
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
    private petsService: PetsService,
    private messageService: MessageService,
    private primeConfig: PrimeNGConfig
  ) {
    this.initializeForm();
    this.primeConfig.setTranslation(this.calendarLocale);
  }

  ngOnInit() {
    this.loadGendersAndSpecies();
  }

  private initializeForm(): void {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      species: [null, Validators.required],
      breed: ['', [Validators.required, Validators.minLength(2)]],
      gender: [null, Validators.required],
      birthDate: [null, Validators.required],
      image: [null],
    });
  }

  showDialog(): void {
    this.visible = true;
    this.loadGendersAndSpecies();
  }

  hideDialog(): void {
    this.visible = false;
    this.petForm.reset();
  }

  private async loadGendersAndSpecies(): Promise<void> {
    try {
      this.isLoading = true;
      const [genderResponse, speciesResponse] = await Promise.all([
        this.petsService.getGenders().toPromise(),
        this.petsService.getSpecies().toPromise()
      ]);

      this.genders = genderResponse?.genders ?? [];
      this.species = speciesResponse?.species ?? [];
    } catch (error) {
      this.showErrorMessage('Nie udało się załadować danych formularza');
    } finally {
      this.isLoading = false;
    }
  }
  onSubmit(): void {
    if (this.petForm.valid) {
      const petData = this.preparePetData();
      this.createPetWithImage(petData);
    } else {
      this.markInvalidFieldsAsTouched();
    }
  }

  private preparePetData(): CreatePetDto {
    const formValue = this.petForm.value;
    return {
      name: formValue.name,
      species: formValue.species,
      breed: formValue.breed,
      gender: formValue.gender,
      birthDate: formValue.birthDate instanceof Date
        ? formValue.birthDate.toISOString()
        : formValue.birthDate
    };
  }

  private createPetWithImage(petData: CreatePetDto): void {
    this.petsService.createPet(petData).subscribe({
      next: (response) => this.handlePetCreationSuccess(response),
      error: (error) => this.handlePetCreationError(error)
    });
  }

  private handlePetCreationSuccess(response: any): void {
    const formValue = this.petForm.value;

    if (response.petId && formValue.image) {
      this.uploadPetImage(response.petId, formValue.image);
    } else {
      this.showSuccessMessage('Pomyślnie dodano zwierzę');
      this.hideDialog();
      this.petAdded.emit();
    }
  }

  private uploadPetImage(petId: string, image: File): void {
    this.petsService.uploadPetImage(petId, image).subscribe({
      next: () => {
        this.showSuccessMessage('Pomyślnie dodano zwierzę wraz ze zdjęciem');
        this.hideDialog();
        this.petAdded.emit();
      },
      error: () => {
        this.showWarningMessage('Dodano zwierzę, ale nie udało się dodać zdjęcia');
        this.hideDialog();
        this.petAdded.emit();
      }
    });
  }

  private handlePetCreationError(error: any): void {
    this.showErrorMessage('Nie udało się dodać zwierzęcia');
  }

  private showSuccessMessage(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail
    });
  }

  private showWarningMessage(detail: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Uwaga',
      detail
    });
  }

  private showErrorMessage(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail
    });
  }

  private markInvalidFieldsAsTouched(): void {
    Object.keys(this.petForm.controls).forEach(key => {
      const control = this.petForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  onImageSelected(file: File) {
    this.petForm.patchValue({image: file});
  }

  onImageRemoved() {
    this.petForm.patchValue({image: null});
  }
}
