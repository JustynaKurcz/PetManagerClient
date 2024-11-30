import {Component, OnInit} from '@angular/core';
import {PetDto} from "../../models/pets/pet-dto";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {PetsService} from "../../services/pets/pets.service";
import {PetItemComponent} from "../pet-item/pet-item.component";

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatCardModule, PaginatorModule, PetItemComponent],
  providers: [PetsService],
  templateUrl: './my-pets.component.html',
  styleUrl: './my-pets.component.css'
})
export class MyPetsComponent implements OnInit {
  pets: PetDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private petsService: PetsService) {
  }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petsService.getPets(this.pageIndex + 1, this.pageSize)
      .subscribe({
        next: (response) => {
          this.pets = response.items;
          this.pageIndex = response.pageIndex;
          this.totalCount = response.totalCount;
        },
        error: (error) => {
          console.error('Error fetching pets', error);
        }
      });
  }

  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page || 0;
    this.pageSize = event.rows || 10;
    this.ngOnInit();
  }
}
