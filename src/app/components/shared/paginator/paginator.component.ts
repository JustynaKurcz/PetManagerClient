import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    PaginatorModule,
    NgIf
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalRecords: number = 0;
  @Input() rowsPerPageOptions: number[] = [6, 9, 12, 15];

  @Output() pageChange = new EventEmitter<{ pageIndex: number, pageSize: number }>();

  handlePageChange(event: PaginatorState): void {
    this.pageChange.emit({
      pageIndex: event.page || 0,
      pageSize: event.rows || this.pageSize
    });
  }
}
