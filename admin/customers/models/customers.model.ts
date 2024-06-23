import {Injectable} from "@angular/core";
import {Models} from "../../models/models";

export interface Customers {
    id?: string;
    name: string;
    address: any;
    contacts: any;
    points: any;
    wallet: any;
    createAt: Date;
    updatedAt: Date;
}

type Callback = (request: any) => void;

@Injectable({providedIn: "root"})
export class CustomersModel extends Models {

    public findAll = async (onSuccess: Callback, onError?: Callback) => {
        const params = {path: 'customers', onError: onError, onSuccess: onSuccess}
        return await this.Requests.get(params);
    }

    public saveCustomer = async (customer: Customers, onSuccess: Callback, onError?: Callback) => {
        const params = {path: 'customers', onError: onError, onSuccess: onSuccess, data: customer}
        return await this.Requests.post(params);
    }

    public isValidForm = (fields: any) => {
        const errors = [];
        const optional = ['points', 'wallet'];
        for (const key in fields) {
            const value = fields[key];
            const included = optional.filter((item: any) => item === key).length;
            if (value === null || value === undefined || value === '') {
                (!included) ? errors.push(key) : {};
            }
        }
        return !errors.length;
    }
}
