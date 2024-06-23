import {Component, OnInit} from '@angular/core';

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../events";
import {DialogModule} from "primeng/dialog";
import {CustomersHistoryTableActions} from "../table/history/customers.history.table.widget";
import {OrdersCustomerWidget} from "../../../orders/widgets/customer/orders.customer.widget";
import {OrdersInvoiceWidget} from "../../../orders/widgets/invoice/orders.invoice.widget";
import {OrdersItemsTableWidget} from "../../../orders/widgets/table/items/orders.items.table.widget";
import {OrdersUpdateWidget} from "../../../orders/widgets/update/orders.update.widget";
import {TabViewModule} from "primeng/tabview";
import {TransactionsTableActions} from "../../../orders/widgets/table/transactions/orders.transactions.table.widget";

@Component({
    selector: 'customers-items-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        DialogModule,
        OrdersCustomerWidget,
        OrdersInvoiceWidget,
        OrdersItemsTableWidget,
        OrdersUpdateWidget,
        TabViewModule,

    ],
    templateUrl: './customers.items.widget.html',

})
export class CustomersItemsWidget implements OnInit {
    items: any[];
    orNumber: string = '';
    isVisible: boolean = false;

    constructor(
        protected _events: Events) {
    }

    async ngOnInit() {
        await this.CustomersItems.setReady();
        await this.CustomersHistoryTable.setReady();
    }

    CustomersItems = {
        setReady: async () => {
            const parent = this.CustomersItems;
        },
    }

    CustomersHistoryTable = {
        setReady: async () => {
            const parent = this.CustomersHistoryTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(CustomersHistoryTableActions.onRowSelected, (results: any) => {
                this.orNumber = results.selected.orNumber;
                this.isVisible = true;
                this._events.set(TransactionsTableActions.onRowSelected, {selected: results.selected});
            });
        }
    }

}
