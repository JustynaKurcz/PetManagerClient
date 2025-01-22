import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DatePipe, NgIf} from "@angular/common";
import {VaccinationDto} from "../../models/health-records/VaccinationDto";

@Component({
  selector: 'app-vaccination-details-dialog',
  standalone: true,
  imports: [
    DialogModule,
    DatePipe,
    NgIf
  ],
  templateUrl: './vaccination-details-dialog.component.html',
  styleUrl: './vaccination-details-dialog.component.css'
})
export class VaccinationDetailsDialogComponent {
  @Input() vaccination!: VaccinationDto;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
