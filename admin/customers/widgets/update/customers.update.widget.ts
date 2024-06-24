import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {Events} from "../../../events";
import {FormsModule} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgClass, NgIf} from "@angular/common";
import {CustomersListTableActions} from "../table/list/customers.list.table.widget";
import {CustomersModel} from "../../models/customers.model";
import {Strings} from "../../../strings";
import {NotifierActions} from "../../../widgets/spinner/spinner.widget";

export enum CustomersUpdateActions {
    onSaved = 'onSaved[CustomersUpdate]',
}

@Component({
    selector: 'customers-update-widget',
    standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        DropdownModule,
        RippleModule,
        SharedModule,
        ToolbarModule,
        FormsModule,
        AvatarModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        NgClass
    ],
    templateUrl: './customers.update.widget.html',
    providers: []
})

export class CustomersUpdateWidget implements OnInit {
    isSubmitted: boolean = false;
    customer: any = {}

    constructor(protected _events: Events,
                protected _strings: Strings,
                protected _customersModel: CustomersModel) {
    }

    async ngOnInit() {
        await this.CustomersUpdate.setReady();
        await this.CustomersListTable.setReady();
    }

    CustomersUpdate = {
        setReady: async () => {
            const parent = this.CustomersUpdate;
            await parent._setDefault();

        },
        _setDefault: async () => {
            const address = {delivery: ''};
            const contacts = {phone: '', email: ''};
            this.customer.address = address;
            this.customer.contacts = contacts;
        },
        onSubmit: async () => {
            this.isSubmitted = true;
            const validate = this._customersModel.validate(this.customer, this._customersModel.requiredFields);
            if (!validate.isValid) {
                return await this._events.set(NotifierActions.onError, {message: this._strings.message['checkRequiredFields']});
            }
            const onSuccess = async (response: any) => {
                await this._events.set(CustomersUpdateActions.onSaved, {response: response.data});
            }
            await this._customersModel.saveCustomer(this.customer, onSuccess).then(async (_: any) => {
                this.isSubmitted = false;
            })
        }
    }

    CustomersListTable = {
        setReady: async () => {
            const parent = this.CustomersListTable;
            await parent._onRowSelected();
        },
        _onRowSelected: async () => {
            this._events.on(CustomersListTableActions.onRowSelected, (results: any) => {
                this.customer = {...results.selected};
                this.customer.contacts = {...results.selected.contacts};
            });
        }
    }
}
