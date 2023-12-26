import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// Models
import { DebitTransactionTypes } from '../models/debit-transaction';

// Temporário
import { faker } from '@faker-js/faker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormType } from '../../enum/FormType.enum';
import { DebitTransactionFormComponent } from './dialog/form/form.component';

@Component({
  selector: 'app-debit-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './debit-transactions.component.html',
  styleUrl: './debit-transactions.component.scss',
})
export class DebitTransactionsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'amount',
    'options',
  ];
  dataSource: MatTableDataSource<any>;
  transactions: any[];

  DebitTransactionTypes = DebitTransactionTypes;
  FormType = FormType;

  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private debitTransactionFormDialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.transactions = fakerData(20);
    this.dataSource = new MatTableDataSource(this.transactions);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
    this.openCategoryFormDialog(FormType.CREATE);
  }

  sumTransactions(transactionType: DebitTransactionTypes) {
    return this.transactions
      .filter((t) => t.transactionType === transactionType)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  calcBalance() {
    return (
      this.sumTransactions(DebitTransactionTypes.REVENUE) -
      this.sumTransactions(DebitTransactionTypes.EXPENSE)
    );
  }

  openCategoryFormDialog(type: FormType, transaction?: any): void {
    const transactionFormRef = this.debitTransactionFormDialog.open(
      DebitTransactionFormComponent,
      {
        data: {
          type,
          ...transaction,
        },
        height: 'auto',
        width: '30rem',
      }
    );
  }
}

function fakerData(quantity: number): any[] {
  let data = [];
  for (let i = 0; i < quantity; i++) {
    data.push({
      id: i + 1,
      description: faker.lorem.sentence({ min: 5, max: 10 }),
      category: {
        id: faker.number.int(),
        name: faker.lorem.sentence(2),
        color: faker.color.rgb(),
      },
      amount: faker.finance.amount(),
      date: faker.date.between({
        from: '2023-12-01T00:00:000Z',
        to: '2023-12-31T00:00:000Z',
      }),
      transactionType: faker.string.fromCharacters(['E', 'R']),
    });
  }
  return data;
}
