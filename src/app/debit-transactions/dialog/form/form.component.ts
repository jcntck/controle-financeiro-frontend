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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Enums
import { FormType } from '../../../../enum/FormType.enum';
import { Observable, map, startWith } from 'rxjs';
import { DebitTransactionTypes } from '../../../models/debit-transaction';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TransactionFormDialogData {
  type: FormType;
  id?: string;
  date?: Date;
  description?: string;
  category?: Category;
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    CurrencyMaskModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class DebitTransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  FormType = FormType;
  DebitTransactionTypes = DebitTransactionTypes;
  categories: Category[] = [];
  filteredCategories?: Observable<Category[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TransactionFormDialogData,
    public dialogRef: MatDialogRef<DebitTransactionFormComponent>,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) {
    this.transactionForm = this.formBuilder.group({
      date: [data.date ?? new Date(), [Validators.required]],
      description: [data.description ?? '', [Validators.required]],
      categoryName: [data.category?.name ?? '', [Validators.required]],
      amount: [data.amount ?? '0.00', [Validators.required]],
      transactionType: [data.transactionType ?? '', [Validators.required]],
    });
  }

  ngOnInit() {
    this.transactionForm.controls['categoryName'].disable();
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        this.filteredCategories = this.transactionForm
          .get('categoryName')!
          .valueChanges.pipe(
            startWith(this.categoryName?.value || ''),
            map((value) => this.filter(value || ''))
          );
        this.transactionForm.controls['categoryName'].enable();
      },
      (error) => {
        this._snackBar.open(error, 'Fechar', {
          verticalPosition: 'top',
        });
        this.transactionForm.disable();
      }
    );
  }

  private filter(value: string): any[] {
    const filterValue = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return this.categories.filter((option) =>
      option.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(filterValue)
    );
  }

  get categoryName() {
    return this.transactionForm.get('categoryName');
  }

  private getCategory(categoryName: string): Category | undefined {
    const filterValue = categoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return this.categories.find((option) =>
      option.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(filterValue)
    );
  }

  onSubmit() {
    const { date, description, categoryName, amount, transactionType } =
      this.transactionForm.value;

    const category = this.getCategory(categoryName);
    if (!category) {
      this.categoryName?.setErrors({ notFound: true });
      return;
    }

    this.dialogRef.close({
      date,
      description,
      category,
      amount,
      transactionType,
    });
  }
}
