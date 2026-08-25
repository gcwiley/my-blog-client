import { Pipe, PipeTransform } from '@angular/core';
import { stripHtml } from '../utils/html.utils';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number, symbol: string) {
    return stripHtml(value).split(' ').slice(0, length).join(' ') + symbol;
  }
}
