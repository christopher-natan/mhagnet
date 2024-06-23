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
import {TransactionsTableActions} from "../table/transactions/orders.transactions.table.widget";

export enum OrdersUpdateActions {
    onSaved = 'onSaved[OrdersUpdate]',
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
    providers: []
})

export class OrdersUpdateWidget implements OnInit {
    elements: any = {};
    customer: any = {};
    invoice: any = {};
    delivery: any = {};
    isSubmitted: boolean = false;
    order: any = {};

    constructor(protected _events: Events,
                protected _resolverService: ResolverService,
                protected _ordersModel: OrdersModel) {
    }

    async ngOnInit() {
        await this.OrdersUpdate.setReady();
        await this.OrdersTransactionTable.setReady();
        await this.Elements.setReady();
    }

    OrdersUpdate = {
        setReady: async () => {
            const parent = this.OrdersUpdate;
            await parent._setDefault();
        },
        onSubmit: async () => {
            const onSuccess = async (response: any) => await this._events.set(OrdersUpdateActions.onSaved, {response: response.data});
            this.order.invoice = this.invoice;
            this.order.delivery = this.delivery;
            this.isSubmitted = true;
            await this._ordersModel.saveOrder(this.order, onSuccess).then(async (_: any) => {
                this.isSubmitted = false;
            })
        },
        _setDefault: async () => {
            this.invoice.paymentStatus = 1;
            this.invoice.orderStatus = 1;
            this.invoice.paymentMethod = 1;
            this.delivery.deliveryDate = new Date().toDateString();
        }
    }

    Elements = {
        setReady: async () => {
            const parent = this.Elements;
            await parent._setElements();
        },
        _setElements: async () => {
            this.elements = this._resolverService.elements;
        }
    }

    OrdersTransactionTable = {
        setReady: async () => {
            const parent = this.OrdersTransactionTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(TransactionsTableActions.onRowSelected, (results: any) => {
                this.order = {...results.selected};
                this.order.invoice = {...this.order.invoice};
                this.order.delivery = {...this.order.delivery};
                this.invoice = this.order.invoice;
                this.delivery.deliveryDate = new Date(this.order.delivery.deliveryDate);
            });
        }
    }
}

/* refactored */
