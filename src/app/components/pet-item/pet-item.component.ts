import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {Button} from "primeng/button";
import {PetDto} from "../../models/pets/pet-dto";

@Component({
  selector: 'app-pet-item',
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    Button
  ],
  templateUrl: './pet-item.component.html',
  styleUrl: './pet-item.component.css'
})
export class PetItemComponent {
  @Input() pet!: PetDto;
}
