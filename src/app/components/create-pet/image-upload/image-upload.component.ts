import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  imagePreview: string | null = null;

  constructor(private messageService: MessageService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.isValidImage(file)) {
      this.handleImageUpload(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');

    const file = event.dataTransfer?.files[0];
    if (file && this.isValidImage(file)) {
      this.handleImageUpload(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
    this.imageRemoved.emit();
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Nieprawidłowy format pliku. Dozwolone formaty: JPEG, PNG, GIF'
      });
      return false;
    }

    if (file.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Plik jest za duży. Maksymalny rozmiar to 5MB'
      });
      return false;
    }

    return true;
  }

  private handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageSelected.emit(file);
    };
    reader.readAsDataURL(file);
  }
}
