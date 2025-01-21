import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {PrimengImports} from "../../constants/primeng-imports";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    PrimengImports,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-profile-form.component.html',
  styleUrl: './edit-profile-form.component.css'
})
export class EditProfileFormComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{firstName: string, lastName: string}>();

  private fb = inject(FormBuilder);
  editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  setFormValues(firstName: string, lastName: string) {
    this.editForm.patchValue({
      firstName,
      lastName
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.editForm.reset();
  }

  saveChanges() {
    if (this.editForm.valid) {
      this.save.emit(this.editForm.value);
      this.closeDialog();
    }
  }
}
