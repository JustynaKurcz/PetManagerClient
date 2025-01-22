import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {NgClass, NgIf} from "@angular/common";
import {PetsService} from "../../services/pets/pets.service";
import {MessageService} from 'primeng/api';
import {AvatarModule} from "primeng/avatar";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-pet-avatar',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    ToastModule,
    NgClass,
    AvatarModule,
    ProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './pet-avatar.component.html',
  styleUrl: './pet-avatar.component.css'
})
export class PetAvatarComponent implements OnInit {
  @Input() petId!: string;
  @Input() photoUrl?: string;
  @Output() photoUpdated = new EventEmitter<string>();

  showControls = false;
  isUploading = false;

  constructor(
    private petsService: PetsService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    if (!this.petId) {
      throw new Error('PetId is required');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];

      if (this.validateFile(file)) {
        this.uploadImage(file);
      }
    }
  }

  private validateFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Dozwolone są tylko pliki JPEG i PNG'
      });
      return false;
    }

    if (file.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Maksymalny rozmiar pliku to 5MB'
      });
      return false;
    }

    return true;
  }

  private uploadImage(file: File): void {
    this.isUploading = true;

    this.petsService.uploadPetImage(this.petId, file).subscribe({
      next: (response : any) => {
        this.photoUrl = response.photoUrl;
        this.photoUpdated.emit(response.photoUrl);
        this.messageService.add({
          severity: 'success',
          summary: 'Sukces',
          detail: 'Zdjęcie zostało zaktualizowane'
        });
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się zaktualizować zdjęcia'
        });
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }
}
