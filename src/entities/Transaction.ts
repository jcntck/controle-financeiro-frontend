import { DataTableItems, DataTableRow } from "@/components/DataTable/Table";

export enum TransactionTypes {
  EXPENSE = "E",
  REVENUE = "R",
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
      headerColumns: ["Data", "Descrição", "Categoria", "Valor", "Situação"],
      rows: [],
    };

    for (const transaction of transactions) {
      const dataTableRow: DataTableRow = {
        id: transaction.id,
        columns: [
          transaction.date.toLocaleDateString(),
          transaction.description,
          transaction.category.name,
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(transaction.amount),
          transaction.debited ? "Sim" : "Não",
        ],
      };
      dataTableItems.rows.push(dataTableRow);
    }

    return dataTableItems;
  }
}
