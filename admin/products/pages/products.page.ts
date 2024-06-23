import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Events} from "app/events";
import {ProductsAddFormActions} from "../widgets/form/add/add.form.widget";

@Component({
    templateUrl: './products.page.html',
    providers: [MessageService]
})
export class ProductsPage implements OnInit, OnDestroy {
    activeIndex: number = 0;

    constructor(protected _events: Events) {
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

    async ngOnDestroy() {
        await this._events.unsubscribe();
    }
}
