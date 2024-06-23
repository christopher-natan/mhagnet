import {Component, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {Orders} from "../../models/orders.model";
import {Events} from "../../../events";
import {TransactionsTableActions} from "../table/transactions/orders.transactions.table.widget";

@Component({
  selector: 'orders-invoice-widget',
  standalone: true,
    imports: [
        CurrencyPipe,
        DividerModule,
        DropdownModule,
        InputNumberModule
    ],
  templateUrl: './orders.invoice.widget.html',
})
export class OrdersInvoiceWidget implements OnInit{
    invoice: any ={}
    selected: Orders;
    constructor(protected _events: Events,) {}

    async ngOnInit() {
        await this.TransactionTable.setReady();
    }

    TransactionTable = {
        setReady: async () => {
            const parent = this.TransactionTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(TransactionsTableActions.onRowSelected, (results: any) => {
                this.selected = results.selected;
                this.invoice = results.selected.invoice;
            });
        }
    }
}
