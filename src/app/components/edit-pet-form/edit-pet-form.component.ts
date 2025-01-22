import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {PrimengImports} from "../../constants/primeng-imports";
import { PetsService } from '../../services/pets/pets.service';
import {MessageService} from "primeng/api";
import {forkJoin} from "rxjs";
import {GetGenderTypesResponse} from "../../models/pets/enums/get-gender-types-response";
import {GetSpeciesTypesResponse} from "../../models/pets/enums/get-species-types-response";

interface EditPetDto {
  species: number;
  breed: string;
  gender: number;
}

@Component({
  selector: 'app-edit-pet-form',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    DialogModule,
    ReactiveFormsModule,
    NgIf,
    DropdownModule,
    InputTextModule,
    PrimengImports
  ],
  providers: [MessageService],
  templateUrl: './edit-pet-form.component.html',
  styleUrl: './edit-pet-form.component.css'
})
export class EditPetFormComponent implements OnInit {
  @Input() petData: any;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  petForm: any;
  isLoading: boolean = true;
  genderTypes: any[] = [];
  speciesTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private petsService: PetsService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      species: [null, Validators.required],
      breed: ['', [Validators.required, Validators.minLength(2)]],
      gender: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadFormData();
  }

  private loadFormData() {
    this.isLoading = true;

    forkJoin({
      genders: this.petsService.getGenders(),
      species: this.petsService.getSpecies()
    }).subscribe({
      next: (response) => {
        this.genderTypes = response.genders.genders;
        this.speciesTypes = response.species.species;

        const selectedGender = this.genderTypes.find(g => g.name === this.petData.gender);
        const selectedSpecies = this.speciesTypes.find(s => s.name === this.petData.species);

        this.petForm.patchValue({
          species: selectedSpecies?.id || null,
          breed: this.petData.breed,
          gender: selectedGender?.id || null
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować danych formularza'
        });
        this.hideDialog();
      }
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      const petData = {
        species: this.petForm.value.species,
        breed: this.petForm.value.breed,
        gender: this.petForm.value.gender
      };

      this.petsService.changePetInformation(this.petData.petId, petData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Dane zwierzaka zostały zaktualizowane'
          });
          this.saved.emit();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating pet:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się zaktualizować danych zwierzaka'
          });
        }
      });
    }
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.petForm.reset();
  }
}
