import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {Events} from "../../../events";
import {OrdersModel} from "../../models/orders.model";
import {FormsModule} from "@angular/forms";
import {ResolverService} from "../../../services/resolver.service";
import {ProductsAddFormActions} from "../../../products/widgets/form/add/add.form.widget";
import {SpinnerService} from "../../../services/spinner.service";
import {NotifierService} from "../../../services/notifier.service";
import {ProductsStrings} from "../../../products/products.strings";
import {TransactionTableActions} from "../table/transaction/transaction.table";

export enum OrdersUpdateActions {
    onSaved = 'onSavedOrder',
}

@Component({
    selector: 'orders-update-widget',
    standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        DropdownModule,
        RippleModule,
        SharedModule,
        ToolbarModule,
        FormsModule
    ],
    templateUrl: './orders.update.widget.html',
    providers: [NotifierService]
})

export class OrdersUpdateWidget implements OnInit {
    orderStatus = [];
    paymentStatus = [];
    paymentMethod = [];
    customer: any = {}
    invoice: any = {}
    delivery: any = {}
    isSubmitted: boolean = false;
    order: any = {};

    constructor(protected _events: Events,
                protected _productsStrings: ProductsStrings,
                protected _resolverService: ResolverService,
                protected _ordersModel: OrdersModel,
                protected _notifierService: NotifierService,
                protected _spinnerService: SpinnerService) {
    }

    async ngOnInit() {
        await this.TransactionTable.setReady();
        await this.Elements.setReady();
        await this.OrdersUpdate.setReady();

    }

    Elements = {
        setReady: async () => {
            const parent = this.Elements;
            await parent._onResolved();
            await parent._setDefault();
        },
        _onResolved: async () => {
            const resolverService = this._resolverService;
            this.orderStatus = resolverService.orderStatus;
            this.paymentStatus = resolverService.paymentStatus;
            this.paymentMethod = resolverService.paymentMethod;
        },
        _setDefault: async () => {
            this.invoice.paymentStatus = 1;
            this.invoice.orderStatus = 1;
            this.invoice.paymentMethod = 1;
            this.delivery.deliveryDate = new Date().toDateString();
        }
    }

    TransactionTable = {
        setReady: async () => {
            const parent = this.TransactionTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(TransactionTableActions.onRowSelected, (results: any) => {
                this.order = {...results.selected};
                this.order.invoice = {...this.order.invoice};
                this.order.delivery = {...this.order.delivery};
                this.invoice = this.order.invoice;
                this.delivery.deliveryDate = new Date(this.order.delivery.deliveryDate);
            });
        }
    }

    OrdersUpdate = {
        setReady: async () => {
            const parent = this.OrdersUpdate;
        },
        Submit: {
            onClick: async () => {
                this.isSubmitted = true;
                await this._spinnerService.show();
                await this.OrdersUpdate.Submit._save();
            },
            _save: async () => {
                const success = async (response: any) => {
                    this.isSubmitted = false;
                    await this._notifierService.success(response.message);
                    await this._events.set(OrdersUpdateActions.onSaved, {response: response.data});
                }
                const error = async (response: any) => {
                    this.isSubmitted = false;
                    await this._notifierService.error(response.message);
                }

                this.order.invoice = this.invoice;
                this.order.delivery = this.delivery;
                await this._ordersModel.saveOrder(this.order).then(async (response: any) => {
                    response.success ? await success(response) : await error(response);
                    await this._spinnerService.hide();
                }).catch(async (_: any) => {
                    await this._notifierService.error(this._productsStrings.message['notifyNetworkError']);
                    await this._spinnerService.hide();
                });
            },
        },
    }
}
