import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PetItemComponent} from "../pet-item/pet-item.component";
import {PetDto} from "../../models/pets/pet-dto";
import {PetsService} from "../../services/pets/pets.service";
import {HttpClientModule} from "@angular/common/http";
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {MessageService} from "primeng/api";
import {PrimengImports} from "../../constants/primeng-imports";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PetFormComponent} from "../create-pet/pet-form/pet-form.component";

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PetItemComponent, PaginatorModule, ...PrimengImports, ProgressSpinnerModule, PetFormComponent],
  providers: [PetsService, MessageService],
  templateUrl: './my-pets.component.html',
  styleUrls: ['./my-pets.component.css']
})
export class MyPetsComponent implements OnInit {
  @ViewChild(PetFormComponent) petFormDialog!: PetFormComponent;
  pets: PetDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = true;

  constructor(
    private petsService: PetsService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petsService.getPets(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        console.log('GetPets success:', response);
        this.pets = response.items;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować zwierząt'
        })
      }
    });
  }

  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page || 0;
    this.pageSize = event.rows || 10;
    this.loadPets();
  }

  showAddPetDialog(): void {
    this.petFormDialog.showDialog();
  }

}
