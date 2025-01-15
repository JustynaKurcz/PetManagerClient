import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {Router} from "@angular/router";
import {Button} from "primeng/button";
import {PetDto} from "../../models/pets/pet-dto";
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-pet-item',
  standalone: true,
  imports: [
    MatCardModule,
    Button,
    CardModule
  ],
  templateUrl: './pet-item.component.html',
  styleUrl: './pet-item.component.css'
})
export class PetItemComponent {
  @Input() pet!: PetDto;
  @Input() index = 0;

  constructor(private router: Router) {}

  navigateToPetDetails() {
    this.router.navigate(['/pet/detail', this.pet.petId]);
  }
}
