import {Component, OnInit} from '@angular/core';

import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../../events";
import {Orders, OrdersItems} from "../../../models/orders.model";
import {LayoutService} from "../../../../layout/service/app.layout.service";
import {TransactionTableActions} from "../transaction/transaction.table";
import {Configs} from "../../../../configs";

@Component({
    selector: 'items-table-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule
    ],
    templateUrl: './items.table.html',

})
export class ItemsTable implements OnInit {
    orders: OrdersItems[] = [];
    selected: Orders;

    constructor(
        protected _events: Events,
        public layoutService: LayoutService) {
    }

    async ngOnInit() {
        await this.ItemsTable.setReady();
        await this.TransactionTable.setReady();
    }

    ItemsTable = {
        setReady: async () => {
            const parent = this.ItemsTable;
        },
        getImage: (images: any) => {
            return Configs.apiImagePath + images[0].name;
        },
    }

    TransactionTable = {
        setReady: async () => {
            const parent = this.TransactionTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(TransactionTableActions.onRowSelected, (results: any) => {
                this.selected = results.selected;
                this.orders = results.selected.products;
            });
        }
    }

}
