import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Configs} from "../../configs";
import {Products} from "../../products/models/products.model";

export interface OrdersItems {
    id: string;
    code: string;
    name: string;
    images: any;
    quantity: number;
    total: number;
}

export interface Orders {
    id?: string;
    customerId: string;
    orNumber: string;
    totalAmount: number;
    type: number;
    paymentStatus: number;
    items: string;
    dateOrdered: Date;
    deliveryDate: Date;
    dateDelivered: Date;
    createAt: Date;
    updatedAt: Date;
}

@Injectable({providedIn: "root"})
export class OrdersModel {
    _url: string = Configs.apiBase;
    constructor(protected http: HttpClient) {
    }

    public findAll = async () => {
        return await firstValueFrom(this.http.get<any>(this._url + 'order'));
    }

    public saveOrder = async (product: Products) => {
        const url = this._url + 'order';
        const headers = this._getHeaders();
        return await firstValueFrom(this.http.post(url, product, {headers})).catch((result) => {
            return result;
        });
    }

    private _getHeaders = (productId?: string) => {
        return new HttpHeaders({'Content-Type': 'application/json', 'Product-Id': productId ? productId : ''});
    }
}
