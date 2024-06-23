import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Products} from "../../products/models/products.model";
import {Events} from "../../events";
import {ProductsListActions} from "../../products/widgets/list/products.list.widget";
import {PosModel} from "../models/pos.model";
import {PosCustomerActions} from "../widgets/customer/pos.customer.widget";

export enum PosActions {
    onSubmitted = 'onSubmitted[Pos]',
    onSaved = 'onSaved[Pos]',
    onCanceled = 'onCanceled[Pos]',
}

@Component({
    templateUrl: './pos.page.html',
    providers: [MessageService]
})
export class PosPage implements OnInit, OnDestroy {
    products: Products[] = [];
    activeIndex: number = 1;
    isItemsTabDisabled = true;

    constructor(protected _events: Events, private _posModel: PosModel) {
    }

    async ngOnInit() {
        await this.PosCustomer.setReady();
        await this.PosPage.setReady();
        await this.ProductsList.setReady();
    }

    PosPage = {
        setReady: async () => {
            const parent = this.PosPage;
            await parent._setDefault();
            await parent._onSaved();
        },
        onSubmit: async () => {
            await this._events.set(PosActions.onSubmitted, {isSuccess: true});
        },
        onCancel: async () => {
            await this._posModel.clearLocalStorage();
            await this._posModel.setDefault();
            await this.PosPage.setTabItemsDisabled();
            await this._events.set(PosActions.onCanceled, {isSuccess: true});
        },
        _onSaved: async () => {
            this._events.on(PosActions.onSaved, (_: any) => {
                this.products = [];
                this.activeIndex = 0;
            });
        },
        _setDefault: async () => {
            this.products = this._posModel.posData['products'];
            this.products.length >= 1 ? await this.PosPage.setTabItemsEnabled() : await this.PosPage.setTabItemsDisabled();
        },
        setTabItemsDisabled: async () => {
            this.activeIndex = 1;
            this.isItemsTabDisabled = true;
        },
        setTabItemsEnabled: async () => {
            this.activeIndex = 0;
            this.isItemsTabDisabled = false;
        },
        hasProducts: () => this._posModel.posData.products.length >= 1,
    }

    PosCustomer = {
        setReady: async () => {
            const parent = this.PosCustomer;
            await parent._onValidatedError();
        },
        _onValidatedError: async () => {
            this._events.on(PosCustomerActions.onValidatedError, (_: any) => {
                this.activeIndex = 1;
            });
        },
    }

    ProductsList = {
        setReady: async () => {
            const parent = this.ProductsList;
            await parent._onAddedToCart();
        },
        _onAddedToCart: async () => {
            this._events.on(ProductsListActions.onAddedToCart, async (_: any) => {
                await this.PosPage.setTabItemsEnabled();
            });
        },
    }

    async ngOnDestroy() {
       await this._events.unsubscribe();
    }
}
