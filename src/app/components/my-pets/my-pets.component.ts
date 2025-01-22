import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PetItemComponent} from "../pet-item/pet-item.component";
import {PetsService} from "../../services/pets/pets.service";
import {MessageService} from "primeng/api";
import {PrimengImports} from "../../constants/primeng-imports";
import {PetFormComponent} from "../create-pet/pet-form/pet-form.component";
import {PaginatorComponent} from "../shared/paginator/paginator.component";
import {EmptyPetsComponent} from "../empty-pets/empty-pets.component";

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [CommonModule, PetItemComponent, ...PrimengImports, PetFormComponent, PaginatorComponent, EmptyPetsComponent],
  providers: [PetsService, MessageService],
  templateUrl: './my-pets.component.html',
  styleUrls: ['./my-pets.component.css']
})
export class MyPetsComponent implements OnInit {
  @ViewChild(PetFormComponent) petFormDialog!: PetFormComponent;

  response: any
  pageIndex: number = 0;
  pageSize: number = 6;
  loading: boolean = true;

  constructor(
    private petsService: PetsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petsService.getPets(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        this.response = response;
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

  onPageChange(event: {pageIndex: number, pageSize: number}): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPets();
  }

  showAddPetDialog(): void {
    this.petFormDialog.showDialog();
  }
}
