import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'ddmmyyyy',
  standalone: true
})
export class DdMmYyyyPipe implements PipeTransform {

  transform(value: string | Date | null): string {
    if (!value) return '-';

    return formatDate(
      value,
      'dd/MM/yyyy',
      'th-TH'
    );
  }
}
