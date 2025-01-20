import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminService } from "../../../services/admin/admin.service";
import { UsersResponse } from "../../../models/admin/users-response";
import {InputTextModule} from "primeng/inputtext";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {PaginatorModule, PaginatorState} from "primeng/paginator";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    PaginatorModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  response!: UsersResponse;
  pageIndex: number = 0;
  pageSize: number = 10;
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadUsers();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.pageIndex = 0;
      this.loadUsers(term.trim());
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  loadUsers(searchTerm?:string): void {
    this.adminService.browseUsers(this.pageIndex + 1, this.pageSize, searchTerm!).subscribe({
      next: (response) => {
        this.response = response;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się załadować użytkowników'
        });
      }
    });
  }

  changePage(newPage: number): void {
    this.pageIndex = newPage;
    this.loadUsers();
  }

  getPageNumbers(): number[] {
    if (!this.response) return [];
    const totalPages = this.response.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  deleteUser(userId: string): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć tego użytkownika?',
      accept: () => {
        this.adminService.deleteUser(userId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Użytkownik został usunięty'
            });
            this.loadUsers();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się usunąć użytkownika'
            });
          }
        });
      }
    });
  }

  onPageChange(event: PaginatorState) {
    this.pageIndex = event.page || 0;
    this.pageSize = event.rows || 10;
    this.loadUsers();
  }
}
