import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {PetDto} from "../../models/pets/pet-dto";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-pet-item',
  standalone: true,
  imports: [
    NgIf
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
