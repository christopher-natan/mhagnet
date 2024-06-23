import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'readableDate'
})
export class ReadableDatePipe implements PipeTransform {
    transform(value: string | Date): string {
        if (!value) return '';

        const date = new Date(value);
        if (isNaN(date.getTime())) return '';

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit', year: 'numeric', month: 'long'
        };
        return date.toLocaleDateString('en-US', options);
    }
}
