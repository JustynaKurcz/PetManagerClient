import {inject, Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService);

  showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: detail,
      life: 3000
    });
  }

  showError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: detail,
      life: 3000
    });
  }
}
