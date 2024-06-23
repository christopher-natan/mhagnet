import {Component, OnInit} from '@angular/core';

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Orders, OrdersItems} from "../../../models/orders.model";
import {TransactionsTableActions} from "../transactions/orders.transactions.table.widget";
import {Widgets} from "../../../../widgets/widgets";
import {ProductImagePipe} from "../../../../pipes/product.image.pipe";

@Component({
    selector: 'orders-items-table-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        ProductImagePipe
    ],
    templateUrl: './orders.items.table.widget.html',

})
export class OrdersItemsTableWidget extends Widgets implements OnInit {
    products: OrdersItems[] = [];
    selected: Orders;

    async ngOnInit() {
        await this.OrdersTransactionTable.setReady();
    }

    OrdersTransactionTable = {
        setReady: async () => {
            const parent = this.OrdersTransactionTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(TransactionsTableActions.onRowSelected, (results: any) => {
                this.selected = results.selected;
                this.products = results.selected.products;
            });
        }
    }

}
