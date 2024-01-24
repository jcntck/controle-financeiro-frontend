import { Component, Inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DebitTransactionFormComponent } from '../form/form.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DebitTransactionTypes } from '../../../models/debit-transaction';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface DebitTransactionImportData {
  date: Date;
  amount: number;
  description: FormControl;
  transactionType: DebitTransactionTypes;
  external_id: string;
  selectedCategory: FormControl;
}

type DebitTransaction = {
  external_id: string;
  date: Date;
  amount: number;
  description: string;
  transactionType: DebitTransactionTypes;
  category: { id: string };
};

@Component({
  selector: 'app-import-data-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './import-data.component.html',
  styleUrl: './import-data.component.scss',
})
export class ImportDataComponent implements OnInit {
  transactions: any[];
  categories: Category[] = [];
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DebitTransactionFormComponent>,
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) {
    this.transactions = this.handlingImportData(data);
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        this._snackBar.open(error, 'Fechar', {
          verticalPosition: 'top',
        });
        this.dialogRef.close();
      }
    );
  }

  formatDataToSave(event: any) {
    this.error = '';
    const transactions: DebitTransaction[] = [];

    for (const item of this.transactions) {
      const transaction: DebitTransaction = {
        external_id: item.external_id,
        date: item.date,
        description: item.description.value,
        category: { id: item.selectedCategory.value },
        amount: item.amount,
        transactionType: item.transactionType,
      };
      transactions.push(transaction);
    }

    if (transactions.some((value) => value.category.id == '')) {
      this.error =
        'Existem transações sem categoria definida, por favor verifique novamente.';
      return;
    }

    this.dialogRef.close(transactions);
  }

  handlingImportData(data: any[]) {
    const transactions = [];
    for (const item of data) {
      const transaction: DebitTransactionImportData = {
        date: this.createDate(item.Data),
        description: new FormControl(item['Descrição']),
        amount: Math.abs(Number(item.Valor)),
        transactionType:
          Number(item.Valor) > 0
            ? DebitTransactionTypes.REVENUE
            : DebitTransactionTypes.EXPENSE,
        external_id: item.Identificador,
        selectedCategory: new FormControl(''),
      };
      transactions.push(transaction);
    }
    return transactions;
  }

  createDate(date: string) {
    const [day, month, year] = date.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
}
