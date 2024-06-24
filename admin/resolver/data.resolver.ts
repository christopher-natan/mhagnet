import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {ResolverService} from "../services/resolver.service";

export const DataResolver: ResolveFn<any> = (route, state) => {
    const resolverService = inject(ResolverService);
    return resolverService.Elements.setReady();
};
