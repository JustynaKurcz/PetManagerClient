import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../services/pets/pets.service';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from "@angular/common/http";
import { PetItemComponent } from "../pet-item/pet-item.component";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import {PetDto} from "../../models/pets/pet-dto";

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatCardModule, PetItemComponent, PaginatorModule],
  providers: [PetsService],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PetListComponent implements OnInit {
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
