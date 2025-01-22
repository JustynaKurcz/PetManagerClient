import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-appointment-details-dialog',
  standalone: true,
  imports: [
    DialogModule,
    NgIf,
    DatePipe
  ],
  templateUrl: './appointment-details-dialog.component.html',
  styleUrl: './appointment-details-dialog.component.css'
})
export class AppointmentDetailsDialogComponent {
  @Input() appointment: any;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
