import {Injectable} from "@angular/core";
import {Models} from "../../models/models";

export interface Customers {
    id?: string;
    name: string;
    address: any;
    contacts: any;
    points: any;
    wallet: any;
}

type Callback = (request: any) => void;

@Injectable({providedIn: "root"})
export class CustomersModel extends Models {
    requiredFields = {
        name: {required: true},
        address: {required: true, schema: {delivery: {required: true}}},
        contacts: {required: true, schema: {email: {required: true}}},
    };

    public findAll = async (onSuccess: Callback, onError?: Callback) => {
        const params = {path: 'customers', onError: onError, onSuccess: onSuccess}
        return await this.Request.get(params);
    }

    public saveCustomer = async (customer: Customers, onSuccess: Callback, onError?: Callback) => {
        const params = {path: 'customers', onError: onError, onSuccess: onSuccess, data: customer}
        return await this.Request.post(params);
    }
}
