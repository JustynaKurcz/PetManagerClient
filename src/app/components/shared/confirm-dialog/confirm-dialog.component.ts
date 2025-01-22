import {Component, Input} from '@angular/core';
import {ConfirmationService} from 'primeng/api/confirmationservice';
import {PrimengImports} from "../../../constants/primeng-imports";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    ...PrimengImports
  ],
  providers: [ConfirmationService],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() header: string = 'Potwierdzenie';
  @Input() message: string = '';
  @Input() acceptLabel: string = 'Tak';
  @Input() rejectLabel: string = 'Nie';
  @Input() acceptButtonClass: string = 'p-button-danger';

  constructor(private confirmationService: ConfirmationService) {
  }

  show(onAccept: () => void, onReject?: () => void): void {
    this.confirmationService.confirm({
      message: this.message,
      accept: () => {
        if (onAccept) onAccept();
      },
      reject: () => {
        if (onReject) onReject();
      }
    });
  }
}
