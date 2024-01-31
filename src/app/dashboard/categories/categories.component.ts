import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';

// Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

// Project Components
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './dialog/form/form.component';

// Enums
import { FormType } from '../../../enum/FormType.enum';

export interface CategoryData {
  id: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
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
})
export class CategoriesComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'color', 'options'];
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>();
  isLoading = false;

  FormType = FormType;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private categoryFormDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getCategories();
  }

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator!;
    // this.dataSource.sort = this.sort!;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCategoryFormDialog(type: FormType, category?: CategoryData): void {
    const categoryFormRef = this.categoryFormDialog.open(
      CategoryFormComponent,
      {
        data: {
          type,
          ...category,
        },
        height: 'auto',
        width: '30rem',
      }
    );

    categoryFormRef.afterClosed().subscribe((categoryData) => {
      if (!categoryData) return;

      if (type === FormType.CREATE) {
        this.createCategory(categoryData);
      } else {
        this.editCategory(category!.id, categoryData);
      }
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.dataSource = new MatTableDataSource(categories);
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
      this.isLoading = false;
    });
  }

  createCategory(categoryData: { name: string; color: string }) {
    this.isLoading = true;
    this.categoryService.createCategory(categoryData).subscribe(
      () => {
        this._snackBar.open('Categoria criada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.getCategories();
      },
      (error) => {
        this._snackBar.open(error, 'Fechar', {
          duration: 3000,
        });
        this.isLoading = false;
        this.openCategoryFormDialog(
          FormType.CREATE,
          categoryData as CategoryData
        );
      }
    );
  }

  editCategory(id: string, categoryData: { name: string; color: string }) {
    this.isLoading = true;
    this.categoryService.updateCategory(id, categoryData).subscribe(
      () => {
        this._snackBar.open('Categoria editada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.getCategories();
      },
      (error) => {
        this._snackBar.open(error, 'Fechar', {
          duration: 3000,
        });
        this.isLoading = false;
        this.openCategoryFormDialog(FormType.UPDATE, {
          id,
          ...categoryData,
        } as CategoryData);
      }
    );
  }

  deleteCategory(id: string) {
    this.isLoading = true;
    this.categoryService.deleteCategory(id).subscribe(() => {
      this._snackBar.open('Categoria deletada com sucesso!', 'Fechar', {
        duration: 3000,
      });
      this.getCategories();
    });
  }
}
