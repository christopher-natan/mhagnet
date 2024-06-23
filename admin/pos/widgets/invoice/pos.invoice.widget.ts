import {Component, OnInit} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {TabViewModule} from "primeng/tabview";
import {PosModel} from "../../models/pos.model";
import {FormsModule} from "@angular/forms";
import {Events} from "../../../events";
import {PosItemsActions} from "../items/pos.items.widget";
import {CurrencyPipe} from "@angular/common";
import {ResolverService} from "../../../services/resolver.service";
import {ElementsPipe} from "../../../pipes/elements.pipe";
import {PosActions} from "../../pages/pos.page";

@Component({
    selector: 'pos-invoice-widget',
    standalone: true,
    imports: [
        DividerModule,
        DropdownModule,
        InputNumberModule,
        TabViewModule,
        FormsModule,
        CurrencyPipe,
        ElementsPipe
    ],
    providers: [CurrencyPipe],
    templateUrl: './pos-invoice.widget.html',
})
export class PosInvoiceWidget implements OnInit {
    paymentMethod = [];
    paymentStatus = [];
    invoice: any = {};
    isDisabled: boolean = true;

    constructor(
        protected _posModel: PosModel,
        private _events: Events,
        protected _resolverService: ResolverService) {
    }

    async ngOnInit(): Promise<void> {
        await this.PosInvoice.setReady();
        await this.Elements.setReady();
        await this.PosPage.setReady();
    }

    PosInvoice = {
        setReady: async () => {
            const parent = this.PosInvoice;
            await parent.setDefault();
            await parent._onInteracted();
            await parent._setIsDisabled();
        },
        setDefault: async () => {
            this.invoice = this._posModel.posData['invoice'];
            this.isDisabled = this._posModel.posData['products'].length <= 0;
        },
        _onInteracted: async () => {
            this._events.on(PosItemsActions.onInteracted, async (_: any) => {
                await this.PosInvoice._calculate();
                await this.PosInvoice._setIsDisabled();
            });
        },
        onKeyupStoreDiscount: async () => {
            await this.PosInvoice._setSubTotalAmount();
            await this.PosInvoice._setOverAllTotalAmount();
        },
        onKeyupCalculate: async () => {
            await this.PosInvoice._setOverAllTotalAmount();
        },
        _setSubTotalAmount: async (): Promise<void> => {
            this.invoice.subTotal = this.invoice.totalAmount - this.invoice.storeDiscount;
        },
        _setOverAllTotalAmount: async (): Promise<void> => {
            this.invoice.overAllTotal = (this.invoice.subTotal - this.invoice.couponDiscount) + this.invoice.deliveryFee + this.invoice.vat;
            await this._posModel.saveLocalStorage('invoice', this.invoice);
        },
        _setIsDisabled: async () => {
            this.isDisabled = this._posModel.posData['products'].length < 1;
        },
        _calculate: async () => {
            const parent = this.PosInvoice;
            const products = this._posModel.posData['products'];
            let totalAmount = 0;
            let totalQuantity = 0;
            products.forEach((product: { total: any; quantity: any; }) => {
                totalAmount = totalAmount + product['setTotal'];
                totalQuantity = totalQuantity + product['setQuantity'];
            });
            this.invoice.totalAmount = totalAmount;
            this.invoice.totalQuantity = totalQuantity;
            await parent._setSubTotalAmount();
            await parent._setOverAllTotalAmount();
        }
    }

    Elements = {
        setReady: async () => {
            const parent = this.Elements;
            await parent._onResolved();
        },
        _onResolved: async () => {
            const elements = this._resolverService.elements;
            this.paymentMethod = elements.paymentMethod;
            this.paymentStatus = elements.paymentStatus;
        }
    }

    PosPage = {
        setReady: async () => {
            const parent = this.PosPage;
            await parent._onSaved();
            await parent._onCanceled();
        },
        _onSaved: async () => {
            this._events.on(PosActions.onSaved, async (_: any) => {
                await this.PosInvoice.setDefault();
            });
        },
        _onCanceled: async () => {
            this._events.on(PosActions.onCanceled, async (_: any) => {
                await this.PosInvoice.setDefault();
            });
        },
    }

}
