import {Component, OnInit} from '@angular/core';

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../events";
import {Products} from "../../../products/models/products.model";
import {ProductsListActions} from "../../../products/widgets/list/products.list.widget";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ConfirmationService, MessageService} from "primeng/api";
import {PosModel} from "../../models/pos.model";
import {RippleModule} from "primeng/ripple";
import {ProductImagePipe} from "../../../pipes/product.image.pipe";
import {PosActions} from "../../pages/pos.page";
import {Strings} from "../../../strings";
import {ToolbarModule} from "primeng/toolbar";
import {Router} from "@angular/router";

export enum PosItemsActions {
    onInteracted = 'onInteracted[PosItems]',
}

@Component({
    selector: 'pos-items-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        InputNumberModule,
        FormsModule,
        ConfirmPopupModule,
        RippleModule,
        ProductImagePipe,
        NgIf,
        ToolbarModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './pos.items.widget.html',

})
export class PosItems implements OnInit {
    products: Products[] = [];
    orderDetails: any = {orNumber: '', referenceCode: ''};

    constructor(
        protected _posModel: PosModel,
        protected _events: Events,
        protected _strings: Strings,
        protected _router: Router,
        protected _confirmationService: ConfirmationService) {
    }

    async ngOnInit() {
        await this.PosItems.setReady();
        await this.ProductsList.setReady();
        await this.PosPage.setReady();
    }

    PosItems = {
        setReady: async () => {
            const parent = this.PosItems;
            await parent._setDefault();
        },
        onInput: async ($event: any, productId: string) => {
            const index = this.products.findIndex((product) => product.id === productId);
            this.products[index]['setTotal'] = this.products[index].price * $event.value;
            await this.PosItems.setOnInteracted();
        },
        onConfirmDelete: ($event: { target: any; }, product: Products) => {
            this._confirmationService.confirm({
                key: product.id,
                target: $event.target || new EventTarget,
                message: this._strings.message['sureToProceed'],
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    this.products = this.products.filter((item) => item.id !== product.id);
                    await this.PosItems.setOnInteracted();
                },
                reject: () => {
                }
            });
        },
        _setDefault: async () => {
            this.products = this._posModel.posData['products'];
        },
        setOnInteracted: async () => {
            await this._posModel.saveLocalStorage('products', this.products);
            await this._events.set(PosItemsActions.onInteracted, {});
        },
        onViewOrder: async() => {
            await this._router.navigate(['/orders']);
        }
    }

    ProductsList = {
        setReady: async () => {
            const parent = this.ProductsList;
            await parent.onAddedToCart();
        },
        onAddedToCart: async () => {
            this._events.on(ProductsListActions.onAddedToCart, async (result: any) => {
                result = {...result.product};
                const index = this.products.findIndex((product) => product.id === result.id);
                const notFound = index == -1;
                const product = this.products[index];
                result['setTotal'] = result.price * result.setQuantity;
                this.orderDetails = {orNumber: '', referenceCode: ''};

                if (notFound) {
                    this.products.push(result);
                } else {
                    this.products[index]['setTotal'] = product['setTotal'] + result['setTotal'];
                    this.products[index]['setQuantity'] = product['setQuantity'] + result.setQuantity;
                }
                await this.PosItems.setOnInteracted();
            });
        },
    }

    PosPage = {
        setReady: async () => {
            const parent = this.PosPage;
            await parent._onSaved();
            await parent.onCanceled();
        },
        _onSaved: async () => {
            this._events.on(PosActions.onSaved, async (results: any) => {
                this.products = []
                this.orderDetails = results.data;
            });
        },
        onCanceled: async () => {
            this._events.on(PosActions.onCanceled, async (_: any) => this.products = []);
        },
    }
}
