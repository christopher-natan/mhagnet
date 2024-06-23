import { Pipe, PipeTransform } from '@angular/core';
import {Configs} from "../configs";

@Pipe({
    standalone: true,
    name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {
    transform(value: string | Array<any>, isBackground: boolean = false): string {
        if (!value) return '';

        const image: any = Array.isArray(value) ? value.length >= 1 ? value[0] : {name: 'none.jpg'} : value;
        return isBackground ? `url(${Configs.apiImagePath + image.name})` : Configs.apiImagePath + image.name;
    }
}
