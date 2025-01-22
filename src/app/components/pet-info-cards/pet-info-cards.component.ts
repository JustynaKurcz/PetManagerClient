import { Component, Input } from '@angular/core';
import { PetDetailsDto } from '../../models/pets/pet-details-dto';
import {InfoCardComponent} from "../info-card/info-card.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-pet-info-cards',
  standalone: true,
  imports: [
    InfoCardComponent,
    DatePipe
  ],
  templateUrl: './pet-info-cards.component.html',
  styleUrl: './pet-info-cards.component.css'
})
export class PetInfoCardsComponent {
  @Input() pet!: PetDetailsDto;
}
