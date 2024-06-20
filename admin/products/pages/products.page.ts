import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Events} from "app/events";
import {ProductsStrings} from "../products.strings";
import {ProductsAddFormActions} from "../widgets/form/add/add.form.widget";

@Component({
    templateUrl: './products.page.html',
    providers: [MessageService]
})
export class ProductsPage implements OnInit {
    activeIndex: number = 0;

    constructor(protected _events: Events,
                protected _productsStrings: ProductsStrings) {
    }

    async ngOnInit() {
        await this.ProductsAddForm.setReady();
    }

    ProductsAddForm = {
        setReady: async () => {
            const parent = this.ProductsAddForm;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(ProductsAddFormActions.onSaved, async (result: any) => {
                this.activeIndex = 3;
            });
        }
    }
}
