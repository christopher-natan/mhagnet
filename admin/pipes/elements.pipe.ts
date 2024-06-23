import {Pipe, PipeTransform} from '@angular/core';
import {ResolverService} from "../services/resolver.service";

@Pipe({
    standalone: true,
    name: 'elements'
})

export class ElementsPipe implements PipeTransform {
    constructor(private readonly resolverService: ResolverService) {
    }
    transform(value: number,  type: string): string {
        if (value < 0) return '';

        const filter = this.resolverService.elements[type].filter((item: { value: number; }) => item.value === value);
        return filter.length >= 1 ? filter[0].label : '';
    }
}
