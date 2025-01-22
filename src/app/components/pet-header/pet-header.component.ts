import {Component, EventEmitter, Input, Output} from "@angular/core";
import { PetDetailsDto } from "../../models/pets/pet-details-dto";
import {PetAvatarComponent} from "../pet-avatar/pet-avatar.component";

@Component({
  selector: 'app-pet-header',
  standalone: true,
  imports: [
    PetAvatarComponent
  ],
  templateUrl: './pet-header.component.html',
  styleUrl: './pet-header.component.css'
})
export class PetHeaderComponent {
  @Input() pet!: PetDetailsDto;
  @Output() photoUpdated = new EventEmitter<void>();
  @Output() editPet = new EventEmitter<void>();
  @Output() deletePet = new EventEmitter<void>();
}
