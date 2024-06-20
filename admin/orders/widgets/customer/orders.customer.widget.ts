import {Component, OnInit} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TransactionTableActions} from "../table/transaction/transaction.table";
import {Events} from "../../../events";
import {Orders} from "../../models/orders.model";

@Component({
    selector: 'orders-customer-widget',
    standalone: true,
    imports: [
        AvatarModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './orders.customer.widget.html'
})
export class OrdersCustomerWidget implements OnInit {
    customer: any = {}
    selected: Orders;

    constructor(protected _events: Events) {
        this.TransactionTable.setDefault();
    }

    async ngOnInit() {
        await this.TransactionTable.setReady();
    }

    TransactionTable = {
        setReady: async () => {
            const parent = this.TransactionTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(TransactionTableActions.onRowSelected, (results: any) => {
                this.selected = results.selected;
                this.customer = results.selected.customer;
            });
        },
        setDefault: () => {
            this.customer.address = {delivery: ''};
            this.customer.contacts = {phone: '', email: ''};
        }
    }

}
