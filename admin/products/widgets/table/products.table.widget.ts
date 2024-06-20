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
import {ProductsStrings} from "../../products.strings";
import {AppUtil} from "app/utils/app.util";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ProductImagePipe} from "../../../pipes/product.image.pipe";
import {SpinnerService} from "../../../services/spinner.service";
import {NotifierService} from "../../../services/notifier.service";
import {ProductsCategoriesActions} from "../categories/products.categories.widget";
import {ProductsAddFormActions} from "../form/add/add.form.widget";

export enum ProductsTableActions {
    onRowSelected = 'onRowSelected',
    onDeleted = 'onDeletedProduct',
    onFindAll = 'onFindAllProducts',
    onClickedAddNew = 'onClickedAddNew',
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
    providers: [ConfirmationService, NotifierService],
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
                protected _productsStrings: ProductsStrings,
                protected _spinnerService: SpinnerService,
                protected _notifierService: NotifierService,
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
            await this._spinnerService.show();
            const success = async (response: any) => {
                this.products = response.data as Products[];
                this.product = this.products[0];
                this.products.map((item) => this.isAvailable[item.id] = Boolean(item.isAvailable));
                await this._events.set(ProductsTableActions.onRowSelected, {selected: this.product});
            }
            const error = async (response: any) => await this._notifierService.error(response.message);
            this._productsModel.findAll().then(async (response: any) => {
                response.success ? await success(response) : await error(response);
                await this._spinnerService.hide();
                await this._events.set(ProductsTableActions.onFindAll, {hasFindAll: true});
            }).catch(async (_: any) => this.ProductsTable.Error._catch());
        },
        setOnRowSelected: async ($event: TableRowSelectEvent) => {
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
                    message: `Are you sure that you want to delete?`,
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
                await this._spinnerService.show();
                const success = async (response: any) => {
                    this.products = [...this.products];
                    this.products = this.products.filter(val => val.id !== this.product.id);
                    await this._notifierService.success(response.message);
                    await this._events.set(ProductsTableActions.onDeleted, this.product);
                    this.product = this.products[0];
                    await this._events.set(ProductsTableActions.onRowSelected, {data: this.product, selected: this.product});
                }
                const error = async (response: any) => {
                    await this._notifierService.error(response.message);
                }
                this._productsModel.deleteProduct(this.product).then(async (response: any) => {
                    response.success ? await success(response) : await error(response);
                    await this._spinnerService.hide();
                }).catch(async (_: any) => this.ProductsTable.Error._catch());
            },
        },
        Error: {
            _catch: async () => {
                await this._notifierService.error(this._productsStrings.message['notifyNetworkError']);
                await this._spinnerService.hide();
            },
        },
        onChangedIsAvailable: ($event: any, product: Products) => {
            const success = async (_: any) => {
                this.product = product;
                this.products[AppUtil.findIndexById(this.products, this.product.id)] = this.product;
                await this._events.set(ProductsTableActions.onRowSelected, {selected: this.product});
            }
            const error = async (response: any) => await this._notifierService.error(response.message);
            product = {...product};
            product.isAvailable = Number($event.checked);
            this._productsModel.saveIsAvailable(product).then(async (response: any) => {
                response.success ? await success(response) : await error(response);
            }).catch(async (_: any) => this.ProductsTable.Error._catch());
        },
        filterProducts(table: Table, $event: Event) {
            table.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
        },
        setOnClickAddNew: async () => {
            await this._events.set(ProductsTableActions.onClickedAddNew, {isClicked: true});
        }
    }

    ProductsUploadImage = {
        setReady: async () => {
            const parent = this.ProductsUploadImage;
            await parent._onUploaded();
        },
        _onUploaded: async () => {
            this._events.on(UploadImageActions.onUploadSuccess, async (result: any) => {
                if (!result.isSuccess) return;
                this.product = {...this.product};
                this.product.images = [...result.images, ...this.product.images];
                this.products[AppUtil.findIndexById(this.products, this.product.id)] = this.product;
                await this.ProductsEditForm.refreshFilter();
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
