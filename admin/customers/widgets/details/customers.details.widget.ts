import {Component, OnInit} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {Events} from "../../../events";
import {Customers} from "../../models/customers.model";
import {CustomersListTableActions} from "../table/list/customers.list.table.widget";
import {CustomersUpdateActions} from "../update/customers.update.widget";

@Component({
    selector: 'customers-details-widget',
    standalone: true,
    imports: [
        AvatarModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './customers.details.widget.html'
})
export class CustomersDetailsWidget implements OnInit {
    customer: Customers;

    constructor(protected _events: Events) {
    }

    async ngOnInit() {
        await this.CustomersListTable.setReady();
        await this.CustomersUpdate.setReady();
    }

    CustomersUpdate = {
        setReady: async () => {
            const parent = this.CustomersUpdate;
            await parent._onSaved();

        },
        _onSaved: async () => {
            this._events.on(CustomersUpdateActions.onSaved, (results: any) => {
                this.customer = results.response;
            });
        },
    }

    CustomersListTable = {
        setReady: async () => {
            const parent = this.CustomersListTable;
            await parent.onRowSelected();
        },
        onRowSelected: async () => {
            this._events.on(CustomersListTableActions.onRowSelected, (results: any) => {
                this.customer = results.selected;
            });
        }
    }
}
