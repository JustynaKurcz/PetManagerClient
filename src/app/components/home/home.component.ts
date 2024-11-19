import {Component, OnInit} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {PetItemComponent} from "../pet-item/pet-item.component";
import {PetDto} from "../../models/pets/pet-dto";
import {PetsService} from "../../services/pets/pets.service";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [HttpClientModule, CommonModule, MatCardModule, PetItemComponent],
  providers: [PetsService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  pets: PetDto[] = [];
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
