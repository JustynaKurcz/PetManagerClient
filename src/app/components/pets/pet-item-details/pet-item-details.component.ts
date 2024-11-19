import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { PetsService } from "../../../services/pets/pets.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {PetDetailsDto} from "../../../models/pets/pet-details-dto";

@Component({
  selector: 'app-pet-item-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  providers: [PetsService],
  templateUrl: './pet-item-details.component.html',
  styleUrls: ['./pet-item-details.component.css']
})
export class PetItemDetailsComponent implements OnInit {
  pet?: PetDetailsDto;

  constructor(
    private petsService: PetsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('petId');
    if (petId) {
      this.loadPetDetails(petId);
    } else {
      console.error('Nie znaleziono petId w parametrach URL.');
    }
  }

  loadPetDetails(petId: string): void {
    this.petsService.getPetDetails(petId).subscribe({
      next: (response) => {
        this.pet = response;
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

}
