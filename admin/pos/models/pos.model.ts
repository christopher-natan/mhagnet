import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Models} from "../../models/models";
import {Events} from "../../events";
import {SpinnerService} from "../../services/spinner.service";
import {Strings} from "../../strings";

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
}

type Callback = (request: any) => void;

@Injectable({providedIn: "root"})
export class PosModel extends Models {
    posData: any = {delivery: {}, customer: {}, products: [], invoice: {}};

    constructor(protected override _http: HttpClient,
                protected override _events: Events,
                protected override _spinnerService: SpinnerService,
                protected override _strings: Strings) {
        super(_http, _events, _spinnerService, _strings);
        this.setDefault().then();
        this._setLocalStorage().then();
    }

    public setDefault = async () => {
        this._setDefaultCustomer().then();
        this._setDefaultInvoice().then();
        this._setDefaultProducts().then();
        this._setDefaultDelivery().then();
    }

    protected _setDefaultCustomer = async () => {
        this.posData['customer'] = {
            name: '',
            address: {delivery: ''},
            contacts: {email: '', phone: ''},
            image: 'profile.jpg'
        };
    }

    protected _setDefaultProducts = async () => {
        this.posData['products'] = [];
    }

    protected _setDefaultDelivery = async () => {
        this.posData['delivery'] = { deliveryDate: new Date() };
    }

    protected _setDefaultInvoice = async () => {
        this.posData['invoice'] = {
            couponDiscount: 0,
            deliveryFee: 0,
            storeDiscount: 0,
            paymentMethod: 1,
            orderStatus: 1,
            paymentStatus: 2,
            totalQuantity: 0,
            totalAmount: 0,
            subTotal: 0,
            vat: 0,
            overAllTotal: 0
        };
    }

    public saveOrder = async (order: any, onSuccess: Callback, onError?: Callback | undefined) => {
        const params = {path: 'order', onError: onError, onSuccess: onSuccess, data: order}
        return await this.Request.post(params);
    }

    public saveLocalStorage = async (name: string, value: any) => {
        this.posData[name] = value;
        localStorage.setItem('posData', JSON.stringify(this.posData));
    }

    public clearLocalStorage = async () => {
        localStorage.removeItem('posData');
    }

    private _setLocalStorage = async () => {
        let storage: any = localStorage.getItem('posData');
        storage !== null ? this.posData = JSON.parse(storage) : this.posData['delivery'] = {deliveryDate: new Date()};
    }
}
