import {Component, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PetsService} from "../../../services/pets/pets.service";

@Component({
  selector: 'app-pets-create',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [PetsService],
  templateUrl: './pet-create.component.html',
  styleUrl: './pet-create.component.css'
})
export class PetCreateComponent implements OnInit {
  petForm!: FormGroup;
  genders: { id: number, name: string }[] = [];
  species: { id: number, name: string }[] = [];

  constructor(private fb: FormBuilder, private petsService: PetsService) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.petsService.getGenders().subscribe({
      next: (response) => {
        this.genders = response.genders;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania listy płci:', error);
      }
    });

    this.petsService.getSpecies().subscribe({
      next: (response) => {
        this.species = response.species;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania listy gatunków:', error);
      }
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      const formValue = this.petForm.value;

      const birthDate = new Date(formValue.birthDate).toISOString();

      const petData = {
        name: formValue.name,
        species: Number(formValue.species),
        breed: formValue.breed,
        gender: Number(formValue.gender),
        birthDate: birthDate
      };

      console.log('Dane do wysłania:', petData);

      this.petsService.createPet(petData).subscribe({
        next: (response) => {
          console.log('Zwierzę zostało dodane pomyślnie', response);
          alert('Zwierzę zostało dodane pomyślnie!');
        },
        error: (error) => {
          console.error('Błąd podczas dodawania zwierzęcia:', error);
          alert('Wystąpił błąd podczas dodawania zwierzęcia.');
        }
      });
    } else {
      alert('Proszę wypełnić wszystkie wymagane pola.');
    }
  }

}
