import { Routes } from '@angular/router';

import { CategoriesComponent } from './dashboard/categories/categories.component';
import { DebitTransactionsComponent } from './debit-transactions/debit-transactions.component';

export const routes: Routes = [
  { path: 'categories', component: CategoriesComponent },
  { path: 'transactions', component: DebitTransactionsComponent },
];
