import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgClass, NgIf} from "@angular/common";
import {RadioButtonModule} from "primeng/radiobutton";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TabViewModule} from "primeng/tabview";

import {Products, ProductsModel} from "app/products/models/products.model";
import {ProductsTableActions} from "../../table/products.table.widget";
import {Events} from "app/events";
import {MenuModule} from "primeng/menu";
import {ToolbarModule} from "primeng/toolbar";
import {NotifierActions} from "../../../../widgets/spinner/spinner.widget";
import {Strings} from "app/strings";

export enum ProductsEditFormActions {
    onSaved = 'onSavedProducts',
    onNew = 'onNew'
}

@Component({
    selector: 'products-edit-form-widget',
    standalone: true,
    imports: [
        ButtonModule,
        DropdownModule,
        FormsModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        RadioButtonModule,
        RippleModule,
        SharedModule,
        NgClass,
        TabViewModule,
        MenuModule,
        ToolbarModule
    ],
    templateUrl: './edit.form.widget.html',
    providers: []
})
export class EditFormWidget implements OnInit {
    product: Products = {};
    products: Products[] = [];
    isSubmitted: boolean = false;

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel,
                protected _strings: Strings) {
    }

    async ngOnInit() {
        await this.ProductsTable.setReady();
        await this.ProductsEditForm.setReady();
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._onRowSelected();
        },
        _onRowSelected: async () => {
            this._events.on(ProductsTableActions.onRowSelected, (results: any) => {
                this.product = {...results.selected};
            })
        }
    }

    ProductsEditForm = {
        setReady: async () => {
            const parent = this.ProductsEditForm;
        },
        onSubmit: async () => {
            this.isSubmitted = true;
            if (!this.ProductsEditForm._isValidForm(this.product)) {
                return await this._events.set(NotifierActions.onError, {message: this._strings.message['checkRequiredFields']});
            }

            const onSuccess = async (response: any) => {
                await this._events.set(ProductsEditFormActions.onSaved, {selected: this.product});
                this.product = {...this.product};
                this.isSubmitted = false;
            }
            await this._productsModel.saveProduct(this.product, onSuccess).then(async (_: any) => {
            })
        },
        _isValidForm: (product: Products) => {
            product = {...{name: '', description: '', price: null, quantity: null, categories: ''}, ...product};
            const errors = [];
            for (const key in product) {
                const value = product[key];
                if (value === null || value === undefined || value === '') {
                    errors.push(key);
                }
            }
            return !errors.length;
        }
    }
}
