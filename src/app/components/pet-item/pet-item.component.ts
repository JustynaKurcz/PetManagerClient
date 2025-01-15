import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {Router, RouterLink} from "@angular/router";
import {Button} from "primeng/button";
import {PetDto} from "../../models/pets/pet-dto";
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-pet-item',
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    Button,
    CardModule
  ],
  templateUrl: './pet-item.component.html',
  styleUrl: './pet-item.component.css'
})
export class PetItemComponent {
  @Input() pet!: PetDto;
  @Input() index: number = 0;

  // protected readonly name = name;

  constructor(private router: Router) {}

  navigateToPetDetails() {
    this.router.navigate(['/pet/detail', this.pet.petId]);
  }
}
