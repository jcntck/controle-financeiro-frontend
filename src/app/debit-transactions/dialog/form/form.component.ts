import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Helpers
import ValidationMessages from '../../../../helpers/ValidationMessages.helper';

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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Enums
import { FormType } from '../../../../enum/FormType.enum';
import { Observable, map, startWith } from 'rxjs';

export interface TransactionFormDialogData {
  type: FormType;
  id?: string;
  date?: Date;
  description?: string;
  categoryName?: string;
  amount?: number;
  transactionType: string;
}

@Component({
  selector: 'app-debit-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class DebitTransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  FormType = FormType;
  categories = [
    { id: 1, name: 'Casa' },
    { id: 2, name: 'Salário' },
    { id: 3, name: 'Academia' },
  ];
  filteredCategories?: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<DebitTransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionFormDialogData,
    private formBuilder: FormBuilder
  ) {
    this.transactionForm = this.formBuilder.group({
      date: [data.date ?? new Date(), []],
      description: [data.description ?? ''],
      categoryName: [data.categoryName ?? ''],
      amount: [data.amount ?? ''],
      transactionType: [data.transactionType ?? ''],
    });
  }

  ngOnInit() {
    this.filteredCategories = this.transactionForm
      .get('categoryName')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this.filter(value || ''))
      );
  }

  private filter(value: string): any[] {
    const filterValue = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    console.log(filterValue);

    return this.categories.filter((option) =>
      option.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(filterValue)
    );
  }

  // get name() {
  //   return this.categoryForm.get('name');
  // }

  getErrorMessage(fieldName: string) {
    const fieldControl = this.transactionForm.get(fieldName)!;
    return ValidationMessages.getErrorMessage(fieldControl.errors);
  }

  onSubmit() {
    this.dialogRef.close(this.transactionForm.value);
  }
}
