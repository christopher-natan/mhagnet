import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {DataView, DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {RatingModule} from "primeng/rating";
import {SelectItem} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {Products, ProductsModel} from "../../models/products.model";
import {Events} from "../../../events";
import {ProductsTableActions} from "../table/products.table.widget";
import {FormsModule} from "@angular/forms";
import {ProductImagePipe} from "../../../pipes/product.image.pipe";

export enum ProductsListActions {
    onAddedToCart = 'onAddedToCart[ProductsList]',
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
        FormsModule,
        ProductImagePipe
    ],
    templateUrl: './products.list.widget.html',
    providers: []

})
export class ProductsListWidget implements OnInit {
    products: Products[] = [];
    sortOptions: SelectItem[] = [];
    setQuantity: any = {};
    sortOrder: number = 0;
    sortField: string = '';

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel) {
    }

    async ngOnInit() {
        await this.ProductsList.setReady();
    }

    ProductsList = {
        setReady: async () => {
            const parent = this.ProductsList;
            await parent._setProducts();
        },
        onClickAddToCart: async (product: Products) => {
            product = {...product};
            product['setQuantity'] = this.setQuantity[product.id];
            product['setTotal'] = 0;
            await this._events.set(ProductsListActions.onAddedToCart, {product: product});
        },
        _setProducts: async () => {
            const onSuccess = async (response: any) => {
                response.data.forEach((product: Products) => this.setQuantity[product.id] = 1);
                this.products = response.data as Products[];
            }
            this._productsModel.findAll(onSuccess).then(async (_: any) => {
                await this._events.set(ProductsTableActions.onFindAll, {hasFetched: true});
            });
        },
        onChangeSort: (event: any) => {
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
        }
    }

}
