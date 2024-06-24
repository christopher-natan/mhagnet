import {Injectable} from "@angular/core";
import {Models} from "../../models/models";

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

type Callback = (request: any) => void;

@Injectable({providedIn: "root"})
export class OrdersModel extends Models {

    public findAll = async (onSuccess: Callback, onError?: Callback | undefined) => {
        const params = {path: 'order', onError: onError, onSuccess: onSuccess}
        return await this.Request.get(params);
    }

    public saveOrder = async (order: Orders, onSuccess: Callback, onError?: Callback | undefined) => {
        const params = {path: 'order', onError: onError, onSuccess: onSuccess, data: order}
        return await this.Request.post(params);
    }
}
