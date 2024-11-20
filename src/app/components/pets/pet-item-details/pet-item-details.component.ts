import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { PetsService } from "../../../services/pets/pets.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { PetDetailsDto } from "../../../models/pets/pet-details-dto";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-pet-item-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, FormsModule],
  providers: [PetsService],
  templateUrl: './pet-item-details.component.html',
  styleUrls: ['./pet-item-details.component.css']
})
export class PetItemDetailsComponent implements OnInit {
  pet?: PetDetailsDto;
  editablePet: any = {};
  isEditMode: boolean = false;
  genders: { id: number, name: string }[] = [];
  species: { id: number, name: string }[] = [];

  constructor(
    private petsService: PetsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('petId');
    if (petId) {
      this.loadPetDetails(petId);
    } else {
      console.error('Nie znaleziono petId w parametrach URL.');
    }
    this.loadSpecies();
    this.loadGenders();
  }

  loadGenders(): void {
    this.petsService.getGenders().subscribe({
      next: (response) => {
        this.genders = response.genders;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania listy płci:', error);
      }
    });
  }

  loadSpecies(): void {
    this.petsService.getSpecies().subscribe({
      next: (response) => {
        this.species = response.species;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania listy gatunków:', error);
      }
    });
  }

  loadPetDetails(petId: string): void {
    this.petsService.getPetDetails(petId).subscribe({
      next: (response) => {
        this.pet = response;
        this.editablePet = {
          ...response
        };
      },
      error: (error) => {
        console.error('Błąd podczas pobierania szczegółów zwierzęcia:', error);
      }
    });
  }

  deletePet(): void {
    if (confirm('Czy na pewno chcesz usunąć to zwierzę?')) {
      this.petsService.deletePet(this.pet?.petId!).subscribe({
        next: () => {
          alert('Zwierzę zostało usunięte pomyślnie.');
          window.location.href = '/pets';
        },
        error: (error) => {
          console.error('Błąd podczas usuwania zwierzęcia:', error);
          alert('Wystąpił błąd podczas usuwania zwierzęcia.');
        }
      });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    if (this.pet) {
      const updatedPet = {
        ...this.editablePet,
        species: +this.editablePet.species,
        genders: +this.editablePet.genders
      };

      this.petsService.changePetInformation(this.pet.petId, updatedPet).subscribe({
        next: () => {
          alert('Zapisano zmiany.');
          this.isEditMode = false;
          this.loadPetDetails(this.pet?.petId!);
        },
        error: (error) => {
          alert('Wystąpił błąd podczas zapisywania zmian.');
        }
      });
    }
  }
}
