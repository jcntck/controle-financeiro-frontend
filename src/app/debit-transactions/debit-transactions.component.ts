import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// Models
import { Category } from '../models/category';
import DebitTransaction, {
  DebitTransactionTypes,
} from '../models/debit-transaction';

// Temporário
import { faker } from '@faker-js/faker';

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

  @ViewChild(MatSort) sort?: MatSort;

  constructor() {
    this.transactions = fakerData(20);
    this.dataSource = new MatTableDataSource(this.transactions);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
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
