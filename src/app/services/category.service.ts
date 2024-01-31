import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';
import ServerErrorsMapper from '../../mapper/ServerErrors.mapper';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url = `${environment.apiUrl}/categories`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<Category[]>(this.url)
      .pipe(catchError(this.handleError));
  }

  createCategory(category: {
    name: string;
    color: string;
  }): Observable<number> {
    return this.httpClient
      .post<number>(this.url, JSON.stringify(category), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCategory(
    id: string,
    category: { name: string; color: string }
  ): Observable<any> {
    return this.httpClient
      .put<void>(`${this.url}/${id}`, category, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: string): Observable<void> {
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
