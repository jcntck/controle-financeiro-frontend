import DataTable from "@/components/DataTable/Table";
import { Transaction } from "../../entities/Transaction";

async function getTransactions(): Promise<Transaction[]> {
  const transactions = await fetch("http://localhost:3001/api/v1/debit-transactions?from=2024-01-01&to=2024-01-31");
  const data = await transactions.json();
  return data.map(
    (item: any) =>
      new Transaction(
        item.id,
        new Date(item.date),
        item.amount,
        item.description,
        item.transactionType,
        item.debited,
        item.category
      )
  );
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return <DataTable items={Transaction.createDataTableItems(transactions)} />;
}
