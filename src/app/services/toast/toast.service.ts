import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: detail,
      life: 3000
    });
  }
}
