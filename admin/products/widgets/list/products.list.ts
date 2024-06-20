import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {DataView, DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {RatingModule} from "primeng/rating";
import {MessageService, SelectItem} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {Products, ProductsModel} from "../../models/products.model";
import {Events} from "../../../events";
import {ProductsStrings} from "../../products.strings";
import {ProductsTableActions} from "../table/products.table.widget";
import {Configs} from "../../../configs";
import {FormsModule} from "@angular/forms";
import {SpinnerService} from "../../../services/spinner.service";
import {NotifierService} from "../../../services/notifier.service";

export enum ProductsListActions {
    onAddToCart = 'onAddToCart',
}

@Component({
    selector: 'products-list-widget',
    standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        CurrencyPipe,
        InputTextModule,
        DataViewModule,
        DropdownModule,
        NgForOf,
        RatingModule,
        InputNumberModule,
        FormsModule
    ],
    templateUrl: './products.list.html',
    providers: [NotifierService]

})
export class ProductsList implements OnInit {
    products: Products[] = [];
    setQuantity: any = {};
    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;
    sortField: string = '';

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel,
                private _notifierService: NotifierService,
                protected _spinnerService: SpinnerService,
                protected _productsStrings: ProductsStrings) {
    }

    async ngOnInit() {
        await this.ProductsList.setReady();
    }

    ProductsList = {
        setReady: async () => {
            const parent = this.ProductsList;
            await parent._setProducts();
        },
        setOnAddToCart: async (product: Products) => {
            product = {...product};
            product['setQuantity'] = this.setQuantity[product.id];
            product['setTotal'] = 0;
            await this._events.set(ProductsListActions.onAddToCart, {product: product});
        },
        _setProducts: async () => {
            const success = async (response: any) => {
                response.data.forEach((product: Products) => this.setQuantity[product.id] = 1);
                this.products = response.data;
            }
            const error = async (response: any) => await this._notifierService.error(response.message);
            this._productsModel.findAll().then(async (response: any) => {
                response.success ? await success(response) : await error(response);
                await this._spinnerService.hide();
                await this._events.set(ProductsTableActions.onFindAll, {hasFetched: true});
            }).catch(async (_: any) => {
                await this._notifierService.error(this._productsStrings.message['notifyNetworkError']);
                await this._spinnerService.hide();
            });
            await this._spinnerService.show();
        },
        onSortChange: (event: any) => {
            const value = event.value;
            if (value.indexOf('!') === 0) {
                this.sortOrder = -1;
                this.sortField = value.substring(1, value.length);
            } else {
                this.sortOrder = 1;
                this.sortField = value;
            }
        },
        onFilter: (dataView: DataView, event: Event) => {
            dataView.filter((event.target as HTMLInputElement).value);
        },
        getImage: (images: Array<any>) => {
            const image: any = images[0];
            return Configs.apiImagePath + image.name;
        },
    }

}
