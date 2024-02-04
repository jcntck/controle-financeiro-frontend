import {
  DataTableFooter,
  DataTableItems,
  DataTableRow,
} from '@/components/DataTable/Table';
import { Formatter } from '@/utils';

export enum TransactionTypes {
  EXPENSE = 'E',
  REVENUE = 'R',
}

export class Transaction {
  constructor(
    readonly id: number,
    readonly date: Date,
    readonly amount: number,
    readonly description: string,
    readonly transactionType: TransactionTypes,
    readonly debited: boolean,
    readonly category: { id: number; name: string; color: string }
  ) {}

  static createDataTableItems(transactions: Transaction[]): DataTableItems {
    const dataTableItems: DataTableItems = {
      headerColumns: ['Data', 'Descrição', 'Categoria', 'Valor', 'Situação'],
      rows: [],
    };

    for (const transaction of transactions) {
      const dataTableRow: DataTableRow = {
        id: transaction.id,
        columns: [
          transaction.date.toLocaleDateString(),
          transaction.description,
          transaction.category.name,
          Formatter.BRL(transaction.amount),
          transaction.debited ? 'Sim' : 'Não',
        ],
      };
      dataTableItems.rows.push(dataTableRow);
    }

    const expenses = Transaction.calculate(
      transactions,
      TransactionTypes.EXPENSE
    );
    const revenue = Transaction.calculate(
      transactions,
      TransactionTypes.REVENUE
    );
    const balance = revenue - expenses;

    dataTableItems.footerTable = [
      {
        label: 'Receitas',
        colspan: 1,
      } as DataTableFooter,
      {
        label: Formatter.BRL(revenue),
        colspan: 1,
      } as DataTableFooter,
      {
        label: 'Despesas',
        colspan: 1,
      } as DataTableFooter,
      {
        label: Formatter.BRL(expenses),
        colspan: 1,
      } as DataTableFooter,
      {
        label: 'Balanço',
        colspan: 1,
      } as DataTableFooter,
      {
        label: Formatter.BRL(balance),
        colspan: 1,
      } as DataTableFooter,
    ];

    return dataTableItems;
  }

  static calculate(transactions: Transaction[], type: TransactionTypes) {
    return transactions.reduce((sum, transaction) => {
      if (transaction.transactionType === type) {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);
  }
}

