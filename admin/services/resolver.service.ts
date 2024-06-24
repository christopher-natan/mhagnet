import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Configs} from "../configs";

@Injectable({
    providedIn: 'root'
})
export class ResolverService {
    _apiBase = Configs.apiBase;
    elements: any = {}
    orderStatus = [];

    constructor(protected _http: HttpClient) {
    }

    Elements = {
        setReady: async () => {
            const parent = this.Elements;
            await parent._setElements();
        },
        _setElements: async () => {
            const parent = this.Elements;
            const success = async (response: any) => {
                const elements = response.data[0];
                this.elements.orderStatus = parent._formatData(elements.orderStatus);
                this.elements.paymentStatus = parent._formatData(elements.paymentStatus);
                this.elements.paymentMethod = parent._formatData(elements.paymentMethod);
                this.elements.productStatus = parent._formatData(elements.productStatus);
                this.elements.userTypes = parent._formatData(elements.userTypes);
                this.elements.userRoles = elements.userRoles;
            };
            const error = async (response: any) => {
            };
            await firstValueFrom(this._http.get<any>(this._apiBase + 'elements')).then(async (response: any) => {
                response.success ? await success(response) : await error(response);
            }).catch(async (_: any) => {
                /* @todo */
            });
        },
        _formatData: (elements: any) => {
            return elements.map((element: { name: any; id: any; }) => {
                return {label: element.name, value: element.id};
            })
        },
    }

}
