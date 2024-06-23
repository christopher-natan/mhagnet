import {Component, OnInit} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PosModel} from "../../models/pos.model";
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {PosActions} from "../../pages/pos.page";
import {Events} from "../../../events";
import {SpinnerService} from "../../../services/spinner.service";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CustomersModel} from "../../../customers/models/customers.model";
import {NotifierActions} from "../../../widgets/spinner/spinner.widget";
import {Strings} from "../../../strings";

export enum PosCustomerActions {
    onValidatedError = 'onValidatedError[PosCustomer]',
}

@Component({
    selector: 'pos-customer-widget',
    standalone: true,
    imports: [
        AvatarModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        NgIf,
        NgClass,
        AutoCompleteModule
    ],
    templateUrl: './pos.customer.widget.html',
    providers: []
})
export class PosCustomerWidget implements OnInit {
    customer: any = {};
    customInfoHolder: any;
    suggestions: any[] | undefined;
    customers: any[] | undefined;
    isSubmitted: boolean = false;

    constructor(protected _posModel: PosModel,
                protected _spinnerService: SpinnerService,
                protected _customersModel: CustomersModel,
                protected _strings: Strings,
                protected _events: Events) {
        this.PosCustomer.setDefault().then();
    }

    async ngOnInit(): Promise<void> {
        await this.PosPage.setReady();
        await this.PosCustomer.setReady();
    }

    PosCustomer = {
        setReady: async () => {
            const parent = this.PosCustomer;
            await parent._setCustomers();
        },
        _setCustomers: async () => {
            const onSuccess = async (response: any) => {
                this.customers = response.data.map((customer: { id: any; name: any; }) => customer);
            }
            this._customersModel.findAll(onSuccess).then(async (_: any) => {
            });
        },
        setDefault: async () => {
            this.isSubmitted = false;
            this.customer = this._posModel.posData['customer'];
            if (this.customer.name !== undefined) this.customInfoHolder = this.customer.name;
        },
        onBlur: async () => {
            await this._posModel.saveLocalStorage('customer', this.customer);
        },
        onSelect: async () => {
            this.customer = this.customInfoHolder;
        },
        onSearch: (event: any) => {
            let suggestions: any[] = [];
            let query = event.query;
            for (let i = 0; i < (this.customers as any[]).length; i++) {
                let customer = (this.customers as any[])[i];
                if (customer.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                    suggestions.push(customer);
                }
            }
            this.suggestions = suggestions;
        }
    }

    PosPage = {
        setReady: async () => {
            const parent = this.PosPage;
            await parent._onSubmitted();
            await parent._onCanceled();
        },
        _onSubmitted: async () => {
            this._events.on(PosActions.onSubmitted, async (_: any) => {
                this.isSubmitted = true;
                if (!this._posModel.isValidForm(this.customer)) {
                    await this._events.set(PosCustomerActions.onValidatedError, {isError: true});
                    return await this._events.set(NotifierActions.onError, {message: this._strings.message['checkRequiredFields']});
                }
                await this.PosPage._saveOrder();
            });
        },
        _replaceNameRule: () => {
            if(this.suggestions.length <= 0 && typeof this.customInfoHolder === 'string') {
                delete this.customer.id;
                this.customer.name = this.customInfoHolder;
            }
        },
        _saveOrder: async () => {
            const onSuccess = async (response: any) => {
                const model = this._posModel;
                this.customInfoHolder = '';
                await model.clearLocalStorage();
                await model.setDefault();
                await this.PosCustomer.setDefault();
                await this._events.set(PosActions.onSaved, {data: response.data});
            }
            this.PosPage._replaceNameRule();
            this._posModel.posData.customer = this.customer;
            console.log(this.customer);
            await this._posModel.saveOrder(this._posModel.posData, onSuccess).then(async (_: any) => {
                this.isSubmitted = false;
            });
        },
        _onCanceled: async () => {
            this._events.on(PosActions.onCanceled, async (_: any) => {
                await this.PosCustomer.setDefault();
            });
        },
    }
}
