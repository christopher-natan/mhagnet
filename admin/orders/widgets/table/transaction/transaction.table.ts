import {Component, OnInit} from '@angular/core';
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, LowerCasePipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Events} from "../../../../events";
import {Orders, OrdersModel} from "../../../models/orders.model";
import {ProductsStrings} from "../../../../products/products.strings";
import {ReadableDatePipe} from "../../../../pipes/readable.date.pipe";
import {ElementsPipe} from "../../../../pipes/elements.pipe";
import {OrdersUpdateActions} from "../../update/orders.update.widget";
import {AppUtil} from "../../../../utils/app.util";
import {SpinnerService} from "../../../../services/spinner.service";
import {NotifierService} from "../../../../services/notifier.service";

export enum TransactionTableActions {
    onRowSelected = 'onRowSelectedTransaction',
}

@Component({
    selector: 'transactions-table-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        ReadableDatePipe,
        LowerCasePipe,
        ElementsPipe
    ],
    templateUrl: './transaction.table.html',
    providers: [NotifierService]
})
export class TransactionTable implements OnInit {
    orders: Orders[];
    selected: Orders;

    constructor(protected _events: Events,
                protected _spinnerService: SpinnerService,
                protected _notifierService: NotifierService,
                protected _ordersModel: OrdersModel,
                protected _productsStrings: ProductsStrings) {
    }

    async ngOnInit() {
        await this.TransactionTable.setReady();
        await this.OrdersUpdate.setReady();
    }

    TransactionTable = {
        setReady: async () => {
            const parent = this.TransactionTable;
            await parent._setTransactions();
        },
        _setTransactions: async () => {
            const success = async (response: any) => {
                this.orders = response.data as Orders[];
                this.selected = this.orders[0];
                await this._events.set(TransactionTableActions.onRowSelected, {selected: this.selected});
            }
            const error = async (response: any) => await this._notifierService.error(response.message);
            this._ordersModel.findAll().then(async (response: any) => {
                response.success ? await success(response) : await error(response);
                await this._spinnerService.hide();
            }).catch(async (_: any) => {
                await this._notifierService.error(this._productsStrings.message['notifyNetworkError']);
                await this._spinnerService.show();
            });
            await this._spinnerService.show();
        },
        setOnRowSelected: async ($event: TableRowSelectEvent) => {
            this.selected = $event.data;
            await this._events.set(TransactionTableActions.onRowSelected, {selected: this.selected});
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
}
