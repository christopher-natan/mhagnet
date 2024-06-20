import {Component, OnInit} from '@angular/core';
import {Events} from "app/events";
import {ProductsTableActions} from "../table/products.table.widget";
import {Products} from "../../models/products.model";
import {ProductImagePipe} from "../../../pipes/product.image.pipe";
import {CurrencyPipe, NgIf} from "@angular/common";
import {ElementsPipe} from "../../../pipes/elements.pipe";
import {ProductsEditFormActions} from "../form/edit/edit.form.widget";
import {ImageModule} from "primeng/image";


@Component({
    selector: 'products-details-widget',
    standalone: true,
    imports: [
        ProductImagePipe,
        CurrencyPipe,
        ElementsPipe,
        NgIf,
        ImageModule
    ],
    templateUrl: './products.details.widget.html'
})
export class ProductsDetailsWidget implements OnInit {
    protected readonly String = String;
    protected readonly Number = Number;
    product: Products;

    constructor(protected _events: Events) {
    }

    async ngOnInit() {
        await this.ProductsTable.setReady();
        await this.ProductsForm.setReady();
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

    ProductsForm = {
        setReady: async () => {
            const parent = this.ProductsForm;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(ProductsEditFormActions.onSaved, (result: any) => this.product = result.selected);
        }
    }
}
