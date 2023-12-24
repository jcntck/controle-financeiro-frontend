import { Category } from './category';

export default interface DebitTransaction {
  id: number;
  date: Date;
  amount: number;
  description: string;
  transactionType: DebitTransactionTypes;
  external_id?: string;
  category: Category;
}

export enum DebitTransactionTypes {
  EXPENSE = 'E',
  REVENUE = 'R',
}
