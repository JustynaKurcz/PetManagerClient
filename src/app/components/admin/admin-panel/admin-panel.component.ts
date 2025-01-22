import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AdminService} from "../../../services/admin/admin.service";
import {UsersResponse} from "../../../models/admin/users-response";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {PaginatorComponent} from "../../shared/paginator/paginator.component";
import {PrimengImports} from "../../../constants/primeng-imports";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ...PrimengImports
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  response: UsersResponse | undefined;
  pageIndex: number = 0;
  pageSize: number = 6;
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

  loadUsers(searchTerm?: string): void {
    this.adminService.browseUsers(this.pageIndex + 1, this.pageSize, searchTerm!).subscribe({
      next: (response: UsersResponse) => {
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

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}
