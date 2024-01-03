import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import DebitTransaction from '../models/debit-transaction';
import ServerErrorsMapper from '../../mapper/ServerErrors.mapper';

@Injectable({
  providedIn: 'root',
})
export class DebitTransactionsService {
  url = `${environment.apiUrl}/debit-transactions`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getTransactions(): Observable<DebitTransaction[]> {
    return this.httpClient
      .get<DebitTransaction[]>(this.url)
      .pipe(catchError(this.handleError));
  }

  createTransaction(transaction: any): Observable<number> {
    return this.httpClient
      .post<number>(this.url, JSON.stringify(transaction), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateTransaction(id: string, transaction: any): Observable<any> {
    return this.httpClient
      .put<void>(`${this.url}/${id}`, transaction, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteTransaction(id: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      console.error(errorMessage);
    } else {
      if (error.status == 0)
        errorMessage =
          'Não foi possível estabelecer comunicação com o servidor!';
      else {
        errorMessage = ServerErrorsMapper.getTranslatedMessage(
          error.error.error
        );
      }
    }
    return throwError(() => errorMessage);
  }
}
