import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PetItemComponent} from "../pet-item/pet-item.component";
import {PetDto} from "../../models/pets/pet-dto";
import {PetsService} from "../../services/pets/pets.service";
import {HttpClientModule} from "@angular/common/http";
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {MessageService} from "primeng/api";
import {PrimengImports} from "../../constants/primeng-imports";
import {AddPetFormComponent} from "../add-pet-form/add-pet-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PetItemComponent, PaginatorModule, ...PrimengImports, AddPetFormComponent],
  providers: [PetsService, MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(AddPetFormComponent) petFormDialog!: AddPetFormComponent;
  pets: PetDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  totalCount: number = 0;

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
        this.pets = response.items;
        this.totalCount = response.totalCount;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować zwierząt'
        });
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
