import {Component, OnInit} from '@angular/core';
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, LowerCasePipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../../events";
import {ReadableDatePipe} from "../../../../pipes/readable.date.pipe";
import {Customers, CustomersModel} from "../../../models/customers.model";
import {ImageModule} from "primeng/image";
import {ProductImagePipe} from "../../../../pipes/product.image.pipe";
import {AvatarModule} from "primeng/avatar";
import {CustomersUpdateActions} from "../../update/customers.update.widget";
import {AppUtil} from "../../../../utils/app.util";

export enum CustomersListTableActions {
    onRowSelected = 'onRowSelected[CustomersList]',
}

@Component({
    selector: 'customers-list-table-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        ReadableDatePipe,
        LowerCasePipe,
        ImageModule,
        ProductImagePipe,
        AvatarModule
    ],
    templateUrl: './customers.list.table.widget.html',
    providers: []

})
export class CustomersListTableWidget implements OnInit {
    customers: Customers[];
    selected: Customers;

    constructor(protected _events: Events,
                protected _customersModel: CustomersModel) {
    }

    async ngOnInit() {
        await this.CustomersListTable.setReady();
        await this.CustomersUpdate.setReady();
    }

    CustomersListTable = {
        setReady: async () => {
            const parent = this.CustomersListTable;
            await parent._setList();
        },
        _setList: async () => {
            const onSuccess = async (response: any) => {
                this.customers = response.data as Customers[];
                this.selected = this.customers[0];
                await this._events.set(CustomersListTableActions.onRowSelected, {selected: this.selected});
            }
            this._customersModel.findAll(onSuccess).then(async (_: any) => {
            })
        },
        setOnRowSelected: async ($event: TableRowSelectEvent) => {
            this.selected = $event.data;
            await this._events.set(CustomersListTableActions.onRowSelected, {selected: this.selected});
        },
    }

    CustomersUpdate = {
        setReady: async () => {
            const parent = this.CustomersUpdate;
            await parent._onSaved();

        },
        _onSaved: async () => {
            this._events.on(CustomersUpdateActions.onSaved, (results: any) => {
                this.selected = results.response;
                this.customers[AppUtil.findIndexById(this.customers, this.selected.id)] = this.selected;
            });
        },
    }
}
