import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {ProductsStrings} from "../../../products.strings";
import {DialogModule} from "primeng/dialog";
import {EditFormWidget} from "../edit/edit.form.widget";
import {ListImageWidget} from "../../image/list/list.image.widget";
import {ProductsCategoriesActions, ProductsCategoriesWidget} from "../../categories/products.categories.widget";
import {ProductsDetailsWidget} from "../../details/products.details.widget";
import {UploadImageWidget} from "../../image/upload/upload.image.widget";
import {NotifierService} from "../../../../services/notifier.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {AppUtil} from "../../../../utils/app.util";
import {SelectButtonModule} from "primeng/selectbutton";
import {InputSwitchModule} from "primeng/inputswitch";

export enum ProductsAddFormActions {
    onSaved = 'onSavedAddForm',
}

@Component({
    selector: 'products-add-form-widget',
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
        ToolbarModule,
        DialogModule,
        EditFormWidget,
        ListImageWidget,
        ProductsCategoriesWidget,
        ProductsDetailsWidget,
        UploadImageWidget,
        SelectButtonModule,
        InputSwitchModule
    ],
    templateUrl: './add.form.widget.html',
    providers: [NotifierService]
})
export class AddFormWidget implements OnInit {
    @ViewChild('input') inputElement!: ElementRef;
    isSubmitted: boolean = false;
    isShow: boolean = false;
    product: Products = {};
    activeIndex: number = 0;
    isAutoClose: boolean = true;

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel,
                private _notifierService: NotifierService,
                private _spinnerService: SpinnerService,
                protected _productsStrings: ProductsStrings) {
    }

    async ngOnInit() {
        await this.ProductsAddForm.setReady();
        await this.ProductsCategories.setReady();
        await this.ProductsTable.setReady();
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._onClickedAddNew();
        },
        _onClickedAddNew: async () => {
            this._events.on(ProductsTableActions.onClickedAddNew, (_: any) => {
                this.isShow = true;
                this.activeIndex = 0;
            })
        }
    }

    ProductsCategories = {
        setReady: async () => {
            const parent = this.ProductsCategories;
            await parent._onSetSelected();
        },
        _onSetSelected: async () => {
            this._events.on(ProductsCategoriesActions.onSetSelected, (results: any) => {
                this.product.categories = results.input;
            });
        },
    }

    ProductsAddForm = {
        setReady: async () => {
            const parent = this.ProductsAddForm;
            await parent._setDefault();
        },
        _setDefault: async () => {
            const images: any= [];
            this.product = {name: '', description: '', quantity: 1, code: AppUtil.createCode(8), price: 0, categories: '', images: images, isAvailable: 1}
            this.isSubmitted = false;
        },
        Submit: {
            onClick: async () => {
                this.isSubmitted = true;
                if (!this.ProductsAddForm.isValidForm()) {
                    this.activeIndex = 0;
                    return await this._notifierService.error(this._productsStrings.message['notifyCheckARequired']);
                }
                if (this.product.categories.length <= 0) return this.activeIndex = 1;
                await this._spinnerService.show();
                await this.ProductsAddForm.Submit._save();
            },
            _save: async () => {
                const success = async (response: any) => {
                    await this._notifierService.success(response.message);
                    await this._events.set(ProductsAddFormActions.onSaved, {added: response.data});
                    await this.ProductsAddForm._setDefault();
                    this.isAutoClose ? this.isShow = false : {};
                    this.activeIndex = 0;
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
        isValidForm: () => {
            const product = {...{name: '', description: '', price: null, quantity: null}, ...this.product};
            const errors = [];
            for (const key in product) {
                const value = product[key];
                (value === null || value === undefined || value === '') && key !== 'categories' ? errors.push(key) : {};
            }
            return !errors.length;
        },
        onFocus: ()  => {
            this.inputElement.nativeElement.select();
        }
    }

}
