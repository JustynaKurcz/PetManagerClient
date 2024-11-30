import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {RouterLink} from "@angular/router";
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
  imageUrl: string = 'https://picsum.photos/id/1025/800/400';
  protected readonly name = name;
}
