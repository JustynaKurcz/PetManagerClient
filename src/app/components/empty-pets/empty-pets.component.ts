import {Component, EventEmitter, Output} from '@angular/core';
import {PrimengImports} from "../../constants/primeng-imports";

@Component({
  selector: 'app-empty-pets',
  standalone: true,
  imports: [
    PrimengImports
  ],
  templateUrl: './empty-pets.component.html',
  styleUrl: './empty-pets.component.css'
})
export class EmptyPetsComponent {
  @Output() addPet = new EventEmitter<void>();

  onAddPet(): void {
    this.addPet.emit();
  }
}
