import {Component, OnInit} from '@angular/core';
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe, NgClass} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../../events";
import {Orders, OrdersModel} from "../../../models/orders.model";
import {ReadableDatePipe} from "../../../../pipes/readable.date.pipe";
import {ElementsPipe} from "../../../../pipes/elements.pipe";
import {OrdersUpdateActions} from "../../update/orders.update.widget";
import {AppUtil} from "../../../../utils/app.util";
import {NotifierService} from "../../../../services/notifier.service";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {ToggleButtonModule} from "primeng/togglebutton";
import {OrdersTogglesActions, OrdersTogglesWidget} from "../../toggles/orders.toggles.widget";

export enum TransactionsTableActions {
    onRowSelected = 'onRowSelected[TransactionsTable]',
}

@Component({
    selector: 'orders-transactions-table-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        ReadableDatePipe,
        ElementsPipe,
        MultiSelectModule,
        FormsModule,
        DatePipe,
        ToggleButtonModule,
        NgClass,
        OrdersTogglesWidget
    ],
    templateUrl: './orders.transactions.table.widget.html',
    providers: [NotifierService]
})
export class OrdersTransactionsTable implements OnInit {
    orders: Orders[];
    ordersCloned: Orders[];
    selected: Orders | undefined;

    constructor(protected _events: Events, protected _ordersModel: OrdersModel) {
    }

    async ngOnInit() {
        await this.OrdersTransactionsTable.setReady();
        await this.OrdersUpdate.setReady();
        await this.OrdersTogglesTable.setReady();
    }

    OrdersTransactionsTable = {
        setReady: async () => {
            const parent = this.OrdersTransactionsTable;
            await parent._setOrders();
        },
        _setOrders: async () => {
            const onSuccess = async (response: any) => {
                this.orders = response.data as Orders[];
                this.ordersCloned = this.orders;
                this.selected = this.orders[0];
                await this.OrdersTransactionsTable.setOnRowSelected(this.selected)
            }
            await this._ordersModel.findAll(onSuccess)
        },
        setOnRowSelected: async ($event: TableRowSelectEvent | any) => {
            this.selected = $event.data !== undefined ? $event.data : $event;
            await this._events.set(TransactionsTableActions.onRowSelected, {selected: this.selected});
        },
    }

    OrdersUpdate = {
        setReady: async () => {
            const parent = this.OrdersUpdate;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(OrdersUpdateActions.onSaved, (result: any) => {
                this.selected = result.response;
                this.orders[AppUtil.findIndexById(this.orders, this.selected.id)] = this.selected;
            });
        },
    }

    OrdersTogglesTable = {
        setReady: async () => {
            const parent = this.OrdersTogglesTable;
            await parent._onToggle();
        },
        _onToggle: async () => {
            this._events.on(OrdersTogglesActions.onToggled, async (results: any) => {
                this.orders = this.ordersCloned.filter((order: any) => results.status.includes(order.invoice.orderStatus.toString()));
                this.selected = this.orders.length >= 1 ? this.orders[0] : undefined;
                this.selected != undefined ? await this.OrdersTransactionsTable.setOnRowSelected(this.selected) : {};
            });
        },
    }
}

/* refactored */
