import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../services/pets/pets.service';
import { Pet } from '../../models/pet/pet';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from "@angular/common/http";
import { PetItemComponent } from "../pet-item/pet-item.component";

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatCardModule, PetItemComponent],
  providers: [PetsService],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;
  constructor(private petsService: PetsService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petsService.getPets(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        this.pets = response.items;
        this.totalCount = response.totalCount;
      },
      error: (error) => {
        console.error('Error fetching pets', error);
      }
    });
  }
}
