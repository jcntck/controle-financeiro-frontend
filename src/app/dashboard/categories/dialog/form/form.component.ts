import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Helpers
import ValidationMessages from '../../../../../helpers/ValidationMessages.helper';

// Material
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Enums
import { FormType } from '../../../../../enum/FormType.enum';

export interface CategoryFormDialogData {
  type: FormType;
  id?: string;
  name?: string;
  color?: string;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  FormType = FormType;

  constructor(
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormDialogData,
    private formBuilder: FormBuilder
  ) {
    this.categoryForm = this.formBuilder.group({
      name: [data.name ?? '', [Validators.required]],
      color: [data.color ?? '#000000'],
    });
  }

  get name() {
    return this.categoryForm.get('name');
  }

  getErrorMessage(fieldName: string) {
    const fieldControl = this.categoryForm.get(fieldName)!;
    return ValidationMessages.getErrorMessage(fieldControl.errors);
  }

  onSubmit() {
    this.dialogRef.close(this.categoryForm.value);
  }
}
