import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'bytesConvert'
})
export class BytesConvertPipe implements PipeTransform {
    transform(value: number, decimalPlaces: number = 2): string {
        if (value == null) {
            return '';
        }
        const kilobytes = value / (1024);
        return kilobytes.toFixed(decimalPlaces) + ' KB';
    }
}
