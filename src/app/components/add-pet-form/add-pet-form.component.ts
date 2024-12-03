import {Component, ElementRef, ViewChild} from '@angular/core';
import {PrimengImports} from "../../constants/primeng-imports";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PetsService} from "../../services/pets/pets.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-add-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...PrimengImports,
  ],
  providers: [PetsService],
  templateUrl: './add-pet-form.component.html',
  styleUrl: './add-pet-form.component.css'
})
export class AddPetFormComponent {
  visible: boolean = false;
  petForm!: FormGroup;
  today: Date = new Date();
  genders: { id: number, name: string }[] = [];
  species: { id: number, name: string }[] = [];

  imagePreview: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private petsService: PetsService,
    private messageService: MessageService
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: [null, Validators.required],
      breed: ['', Validators.required],
      gender: [null, Validators.required],
      birthDate: [null, Validators.required],
      image: [null]
    });
  }

  showDialog(): void {
    this.visible = true;
  }

  hideDialog(): void {
    this.visible = false;
    this.petForm.reset();
  }

  onSubmit(): void {
    if (this.petForm.valid) {
      const formData = this.petForm.value;

      this.petsService.createPet(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Pomyślnie dodano zwierzę'
          });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się dodać zwierzęcia'
          });
        }
      });
    } else {
      Object.keys(this.petForm.controls).forEach(key => {
        const control = this.petForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  loadGendersAndSpecies(): void {
    this.petsService.getGenders().subscribe({
      next: (response) => {
        this.genders = response.genders;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania listy płci:', error);
      }
    });

    this.petsService.getSpecies().subscribe({
      next: (response) => {
        this.species = response.species;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania listy gatunków:', error);
      }
    });
  }

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

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
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
    this.petForm.patchValue({image: null});
    this.fileInput.nativeElement.value = '';
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      // Dodaj obsługę błędu - nieprawidłowy format
      return false;
    }

    if (file.size > maxSize) {
      // Dodaj obsługę błędu - za duży rozmiar
      return false;
    }

    return true;
  }

  private handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.petForm.patchValue({ image: file });
    };
    reader.readAsDataURL(file);
  }
}
