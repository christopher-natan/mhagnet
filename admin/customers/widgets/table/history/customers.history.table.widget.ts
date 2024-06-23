import {Component, OnInit} from '@angular/core';

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../../events";
import {OrdersItems} from "../../../../orders/models/orders.model";
import {ProductImagePipe} from "../../../../pipes/product.image.pipe";
import {ReadableDatePipe} from "../../../../pipes/readable.date.pipe";
import {Products} from "../../../../products/models/products.model";
import {CustomersItemsWidget} from "../../items/customers.items.widget";
import {CustomersListTableActions} from "../list/customers.list.table.widget";

export enum CustomersHistoryTableActions {
    onRowSelected = 'onRowSelected[CustomersHistory]'
}

@Component({
    selector: 'customers-history-table-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        ProductImagePipe,
        ReadableDatePipe,
        CustomersItemsWidget
    ],
    templateUrl: './customers.history.table.widget.html',

})
export class CustomersHistoryTableWidget implements OnInit {
    orders: OrdersItems[] = [];
    order: Products = {};

    constructor(
        protected _events: Events) {
    }

    async ngOnInit() {
        await this.CustomersHistoryTable.setReady();
        await this.CustomersListTable.setReady();
    }

    CustomersHistoryTable = {
        setReady: async () => {
            const parent = this.CustomersHistoryTable;
        },
        onRowSelect: async ($event: any) => {
            await this._events.set(CustomersHistoryTableActions.onRowSelected, {selected: $event.data});
        }
    }

    CustomersListTable = {
        setReady: async () => {
            const parent = this.CustomersListTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(CustomersListTableActions.onRowSelected, (results: any) => {
                this.orders = results.selected.order;
            });
        }
    }

}
