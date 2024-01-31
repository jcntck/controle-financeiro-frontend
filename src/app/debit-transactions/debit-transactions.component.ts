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
import { CurrencyMaskModule } from 'ng2-currency-mask';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Models
import DebitTransaction, {
  DebitTransactionTypes,
} from '../models/debit-transaction';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormType } from '../../enum/FormType.enum';
import { DebitTransactionsService } from '../services/debit-transactions.service';
import { DebitTransactionFormComponent } from './dialog/form/form.component';
import { ImportDataComponent } from './dialog/import-data/import-data.component';
import {
  MatDatepickerModule,
  MatDatepicker,
} from '@angular/material/datepicker';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ImportDataButtonComponent } from '../shared/import-data-button/import-data-button.component';
import { firstValueFrom, lastValueFrom } from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-debit-transactions',
  standalone: true,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
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
    CurrencyMaskModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    ImportDataButtonComponent,
    MatProgressBarModule,
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
  transactions: any[] = [];
  isLoading = false;
  selectedMonth = new FormControl(moment());
  options?: { from: string; to: string };

  totalValues = {
    expense: 0,
    revenue: 0,
    balance: 0,
  };

  DebitTransactionTypes = DebitTransactionTypes;
  FormType = FormType;

  @ViewChild(MatSort) sort?: MatSort;

  importData: any[] = [];
  progressImportDataInformation = {
    isActive: false,
    progressBar: 0,
    totalRows: 0,
    processedRows: 0,
    stepDescription: '',
  };

  constructor(
    private debitTransactionFormDialog: MatDialog,
    private importDataDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private debitTransactionService: DebitTransactionsService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.isLoading = true;
    this.getTransactions();
  }

  ngAfterViewInit(): void {}

  sumTransactions(transactionType: DebitTransactionTypes) {
    return this.transactions
      .filter((t) => t.transactionType === transactionType)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  calcBalance() {
    this.totalValues.expense = this.sumTransactions(
      DebitTransactionTypes.EXPENSE
    );
    this.totalValues.revenue = this.sumTransactions(
      DebitTransactionTypes.REVENUE
    );
    this.totalValues.balance =
      this.totalValues.revenue - this.totalValues.expense;
  }

  getTransactions(options?: any) {
    this.debitTransactionService
      .getTransactions(options)
      .subscribe((transactions: DebitTransaction[]) => {
        this.transactions = transactions;
        this.dataSource = new MatTableDataSource(transactions);
        this.dataSource.sort = this.sort!;
        this.calcBalance();
        this.isLoading = false;
      });
  }

  openTransactionFormDialog(type: FormType, transaction?: any): void {
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

    transactionFormRef.afterClosed().subscribe((transactionData) => {
      if (!transactionData) return;

      if (type === FormType.CREATE) {
        this.createTransaction(transactionData);
      } else {
        this.editTransaction(transaction!.id, transactionData);
      }
    });
  }

  createTransaction(transactionData: any) {
    this.isLoading = true;
    this.debitTransactionService.createTransaction(transactionData).subscribe(
      () => {
        this._snackBar.open('Transação criada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.getTransactions(this.options);
      },
      (error) => {
        this._snackBar.open(error, 'Fechar', {
          duration: 3000,
        });
        this.isLoading = false;
        this.openTransactionFormDialog(FormType.CREATE, transactionData);
      }
    );
  }

  editTransaction(id: string, transactionData: any) {
    this.isLoading = true;
    this.debitTransactionService
      .updateTransaction(id, transactionData)
      .subscribe(
        () => {
          this._snackBar.open('Transação editada com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.getTransactions(this.options);
        },
        (error) => {
          this._snackBar.open(error, 'Fechar', {
            duration: 3000,
          });
          this.isLoading = false;
          this.openTransactionFormDialog(FormType.UPDATE, {
            id,
            ...transactionData,
          });
        }
      );
  }

  deleteTransaction(id: string) {
    this.isLoading = true;
    this.debitTransactionService.deleteTransaction(id).subscribe(() => {
      this._snackBar.open('Transação deletada com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.getTransactions(this.options);
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  getBalanceColor() {
    const { balance } = this.totalValues;
    if (balance === 0) return '#5b5b5b';
    return balance < 0 ? '#f44336' : '#38761d';
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.selectedMonth.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.selectedMonth.setValue(ctrlValue);
    datepicker.close();
  }

  selectMonth() {
    const date = this.selectedMonth.value;
    const month = date?.month();
    const year = date?.year();
    this.options = {
      from: new Date(year!, month!, 1).toJSON(),
      to: new Date(year!, month! + 1, 0).toJSON(),
    };
    this.isLoading = true;
    this.getTransactions(this.options);
  }

  resetSelectedMonth() {
    this.selectedMonth = new FormControl(moment());
    this.selectMonth();
  }

  setImportDataError(event: string) {
    this._snackBar.open(event, 'Fechar', {
      duration: 3000,
    });
  }

  async setImportData(event: any) {
    this.progressImportDataInformation.progressBar = 0;
    this.progressImportDataInformation.stepDescription =
      'Lendo o arquivo enviado ...';

    const transactionsIds = event.map((value: any) => value.Identificador);
    const transactionsCreated$ =
      this.debitTransactionService.getTransactionsByExternalIds(
        transactionsIds
      );
    const transactionsCreated = await lastValueFrom(transactionsCreated$);
    this.importData = event.filter(
      ({ Identificador }: any) => !transactionsCreated.includes(Identificador)
    );

    if (!this.importData.length) {
      this._snackBar.open(
        'Todos as transações deste extrato já foram inseridas',
        'Fechar',
        {
          duration: 3000,
        }
      );
      return;
    }

    this.progressImportDataInformation.isActive = true;
    this.progressImportDataInformation.totalRows = this.importData.length;
    this.progressImportDataInformation.stepDescription =
      'Preparando dados para o envio ...';
    this.openImportDataDialog(this.importData);
  }

  openImportDataDialog(importData: any) {
    const importDataDialogRef = this.importDataDialog.open(
      ImportDataComponent,
      {
        data: importData,
      }
    );

    importDataDialogRef.afterClosed().subscribe(async (data) => {
      let progress = 0;
      this.progressImportDataInformation.stepDescription =
        'Cadastrando transações ...';
      for await (const item of data) {
        await firstValueFrom(
          this.debitTransactionService.createTransaction(item)
        );
        this.progressImportDataInformation.progressBar = Math.floor(
          (++progress / this.importData.length) * 100
        );
        this.progressImportDataInformation.processedRows = progress;
      }
      await new Promise((r) => setTimeout(r, 2000));
      this.progressImportDataInformation.isActive = false;
      this.isLoading = true;
      this.getTransactions();
    });
  }
}
