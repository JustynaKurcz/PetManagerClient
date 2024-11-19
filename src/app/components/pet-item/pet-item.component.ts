import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-pet-item',
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink
  ],
  templateUrl: './pet-item.component.html',
  styleUrl: './pet-item.component.css'
})
export class PetItemComponent {
  @Input() pet?: { petId: string, name: string };
}
