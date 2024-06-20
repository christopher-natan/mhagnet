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
import {CategoriesListActions, CategoriesListWidget} from "app/categories/widgets/list/categories.list.widget";
import {Products, ProductsModel} from "app/products/models/products.model";
import {ProductsTableActions} from "../../table/products.table.widget";
import {Events} from "app/events";
import {MenuModule} from "primeng/menu";
import {ToolbarModule} from "primeng/toolbar";
import {ProductsStrings} from "../../../products.strings";
import {NotifierService} from "../../../../services/notifier.service";
import {SpinnerService} from "../../../../services/spinner.service";

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
        CategoriesListWidget,
        MenuModule,
        ToolbarModule
    ],
    templateUrl: './edit.form.widget.html',
    providers: [NotifierService]
})
export class EditFormWidget implements OnInit {
    product: Products = {};
    products: Products[] = [];
    isSubmitted: boolean = false;

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel,
                protected _notifierService: NotifierService,
                protected _spinnerService: SpinnerService,
                protected _productsStrings: ProductsStrings) {
    }

    async ngOnInit() {
        await this.ProductsTable.setReady();
        await this.CategoriesList.setReady();
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
        Submit: {
            onClick: async () => {
                this.isSubmitted = true;
                if (!this._productsModel.isValidForm(this.product)) {
                    return await this._notifierService.error(this._productsStrings.message['notifyCheckARequired']);
                }
                await this._spinnerService.show();
                await this.ProductsEditForm.Submit._save();
            },
            _save: async () => {
                const success = async (response: any) => {
                    await this._notifierService.success(response.message);
                    await this._events.set(ProductsEditFormActions.onSaved, {selected: this.product});
                    this.product = {...this.product};
                }
                const error = async (response: any) => {
                    await this._notifierService.error(response.message);
                }
                await this._productsModel.saveProduct(this.product).then(async (response: any) => {
                    response.success ? await success(response) : await error(response);
                    await this._spinnerService.hide();
                }).catch(async (_: any) => {
                    await this._notifierService.error(this._productsStrings.message['notifyNetworkError']);
                    await this._spinnerService.hide();
                });
            },
        },
    }

    CategoriesList = {
        setReady: async () => {
            const parent = this.CategoriesList;
            await parent._onNodeSelected();
        },
        _onNodeSelected: async () => {
            this._events.on(CategoriesListActions.onNodeSelected, (results: any) => {
                this.product.categories = Object.values(results).join(',');
            })
        },
    }
}
