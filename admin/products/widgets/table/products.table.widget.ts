import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService} from "primeng/api";
import {Table, TableModule, TableRowSelectEvent} from "primeng/table";
import {Events} from "app/events";
import {Products, ProductsModel} from "app/products/models/products.model";
import {ProductsEditFormActions} from "../form/edit/edit.form.widget";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {CurrencyPipe, NgIf} from "@angular/common";
import {UploadImageActions} from "../image/upload/upload.image.widget";
import {ListImageActions} from "../image/list/list.image.widget";
import {AppUtil} from "app/utils/app.util";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ProductImagePipe} from "../../../pipes/product.image.pipe";
import {ProductsCategoriesActions} from "../categories/products.categories.widget";
import {ProductsAddFormActions} from "../form/add/add.form.widget";
import {Strings} from "../../../strings";

export enum ProductsTableActions {
    onRowSelected = 'onRowSelected[ProductsTable]',
    onDeleted = 'onDeleted[ProductsTable]',
    onFindAll = 'onFindAll[ProductsTable]',
    onClickedAddNew = 'onClickedAddNew[ProductsTable]',
}

@Component({
    selector: 'products-table-widget',
    standalone: true,
    imports: [
        TableModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        DialogModule,
        NgIf,
        CurrencyPipe,
        InputSwitchModule,
        FormsModule,
        ConfirmPopupModule,
        ProductImagePipe
    ],
    providers: [ConfirmationService],
    templateUrl: './products.table.widget.html'
})
export class ProductsTableWidget implements OnInit {
    @ViewChild('filter') inputFilter!: ElementRef;
    config = {
        responsiveLayout: 'scroll',
        rows: 10,
        paginator: true,
        rowsPerPageOptions: [10, 20, 30],
        showCurrentPageReport: true,
        currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
        selectionMode: 'single',
        isRowHover: true,
        dataKey: 'id',
        globalFilterFields: [] = ['name', 'code', 'price', 'quantity']
    }
    products: Products[] = [];
    product: Products = {};
    isAvailable: {} = {};
    productsFilter: any;

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel,
                protected _strings: Strings,
                protected _confirmationService: ConfirmationService) {
    }

    async ngOnInit() {
        await this.ProductsEditForm.setReady();
        await this.ProductsTable.setReady();
        await this.ProductsUploadImage.setReady();
        await this.ProductsListImage.setReady();
        await this.ProductsCategories.setReady();
        await this.ProductsAddForm.setReady();
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._setProducts();
        },
        _setProducts: async () => {
            const onSuccess = async (response: any) => {
                this.products = response.data as Products[];
                this.product = this.products[0];
                this.products.map((item) => this.isAvailable[item.id] = Boolean(item.isAvailable));
                await this._events.set(ProductsTableActions.onRowSelected, {selected: this.product});
            }
            this._productsModel.findAll(onSuccess).then(async (_: any) => {
                await this._events.set(ProductsTableActions.onFindAll, {hasFindAll: true});
            });
        },
        onRowSelect: async ($event: TableRowSelectEvent) => {
            await this._events.set(ProductsTableActions.onRowSelected, {selected: $event.data});
        },
        Delete: {
            onClick: async ($event: { target: any; }, product: Products) => {
                const parent = this.ProductsTable.Delete;
                this.product = product;
                await this._events.set(ProductsTableActions.onRowSelected, {data: this.product, selected: product});
                this._confirmationService.confirm({
                    key: product.id,
                    target: $event.target || new EventTarget,
                    message: this._strings.message['sureToProceed'],
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
                        this.product = {...product};
                        await parent._confirmed();
                    },
                    reject: () => {
                    }
                });
            },
            _confirmed: async () => {
                const onSuccess = async (response: any) => {
                    this.products = [...this.products];
                    this.products = this.products.filter(val => val.id !== this.product.id);
                    this.product = this.products[0];
                    await this._events.set(ProductsTableActions.onDeleted, this.product);
                    await this._events.set(ProductsTableActions.onRowSelected, {data: this.product, selected: this.product});
                }
                this._productsModel.deleteProduct(this.product, onSuccess).then(async (_: any) => {
                });
            },
        },
        onChangeIsAvailable: ($event: any, product: Products) => {
            const onSuccess = async (_: any) => {
                this.product = product;
                this.products[AppUtil.findIndexById(this.products, this.product.id)] = this.product;
                await this._events.set(ProductsTableActions.onRowSelected, {selected: this.product});
            }
            product = {...product};
            product.isAvailable = Number($event.checked);
            this._productsModel.saveIsAvailable(product, onSuccess).then(async (_: any) => {
            });
        },
        onInputFilter(table: Table, $event: Event) {
            table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
        },
        onClickAddNew: async () => {
            await this._events.set(ProductsTableActions.onClickedAddNew, {isClicked: true});
        }
    }

    ProductsUploadImage = {
        setReady: async () => {
            const parent = this.ProductsUploadImage;
            await parent._onUploadSuccess();
        },
        _onUploadSuccess: async () => {
            this._events.on(UploadImageActions.onUploadSuccess, async (result: any) => {
                if (!result.isSuccess) return;
                this.product = {...this.product};
                this.product.images = [...result.images, ...this.product.images];
                this.products[AppUtil.findIndexById(this.products, this.product.id)] = this.product;
                await this.ProductsEditForm.refreshFilter();
                await this._events.set(ProductsTableActions.onRowSelected, {selected: this.product});
            });
        }
    }

    ProductsEditForm = {
        setReady: async () => {
            const parent = this.ProductsEditForm;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(ProductsEditFormActions.onSaved, async (result: any) => {
                this.products[AppUtil.findIndexById(this.products, result.selected.id)] = result.selected;
                this.product = result.selected;
                await this.ProductsEditForm.refreshFilter();
            });
        },
        refreshFilter: async () => {
            if (this.productsFilter === undefined) return;
            this.productsFilter.trim().length >= 1 ? this.inputFilter.nativeElement.dispatchEvent(new Event('input')) : {};
        }

    }

    ProductsAddForm = {
        setReady: async () => {
            const parent = this.ProductsAddForm;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(ProductsAddFormActions.onSaved, async (result: any) => {
                this.products = [result.added, ...this.products];
                this.products[AppUtil.findIndexById(this.products, result.added.id)] = result.added;
                this.product = this.products[0];
                await this._events.set(ProductsTableActions.onRowSelected, {selected: this.product});
                this.products.map((item) => this.isAvailable[item.id] = Boolean(item.isAvailable));
                this.inputFilter.nativeElement.value = '';
                this.inputFilter.nativeElement.dispatchEvent(new Event('input'));
            });
        },
    }

    ProductsListImage = {
        setReady: async () => {
            const parent = this.ProductsListImage;
            await parent._onDeleted();
        },
        _onDeleted: async () => {
            this._events.on(ListImageActions.onDeleted, async (result: any) => {
                this.product = {...this.product};
                this.product.images = result.images;
                this.products[AppUtil.findIndexById(this.products, this.product.id)] = this.product;
                await this.ProductsEditForm.refreshFilter();
            });
        }
    }

    ProductsCategories = {
        setReady: async () => {
            const parent = this.ProductsCategories;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(ProductsCategoriesActions.onSaved, async (result: any) => {
                this.product = {...this.product};
                this.product.categories = result.categories.map((item: string) => {
                    return {id: item};
                });
                this.products[AppUtil.findIndexById(this.products, this.product.id)] = this.product;
            });
        }
    }
}
