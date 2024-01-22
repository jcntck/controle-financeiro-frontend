import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'import-data-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './import-data-button.component.html',
  styleUrl: './import-data-button.component.scss',
})
export class ImportDataButtonComponent {
  @Output() errorEvent = new EventEmitter<string>();
  @Output() dataEvent = new EventEmitter<any[]>();

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || file.type !== 'text/csv') {
      this.errorEvent.emit('Arquivo inválido');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const csvRecordsArray = (<string>reader.result).split(/\r\n|\n/);
      const records = this.formatData(csvRecordsArray);
      this.dataEvent.emit(records);
    };
  }

  formatData(csvRecordsArray: string[]) {
    const records = [];

    const headers = csvRecordsArray.shift()!.split(',');
    for (const item of csvRecordsArray) {
      const record: any = {};
      const data = item.split(',');

      if (data.length === headers.length) {
        for (const [index, value] of data.entries()) {
          record[headers[index]] = value;
        }
        records.push(record);
      }
    }

    return records;
  }
}
