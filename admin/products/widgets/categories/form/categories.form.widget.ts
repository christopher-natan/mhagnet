import {Component, OnInit, ViewChild} from '@angular/core';
import {TreeModule} from "primeng/tree";
import {Products} from "app/products/models/products.model";
import {Categories, CategoriesModel} from "app//categories/models/categories.model";
import {Events} from "app/events";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgClass, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {TableModule} from "primeng/table";
import {RippleModule} from "primeng/ripple";
import {ProductsCategoriesActions} from "../products.categories.widget";

export enum CategoriesFormActions {
    onSaved = "onSavedCategories[CategoriesForm]"
}

@Component({
    selector: 'categories-form-widget',
    standalone: true,
    imports: [
        TreeModule,
        FormsModule,
        InputTextModule,
        NgIf,
        NgClass,
        ButtonModule,
        DropdownModule,
        DialogModule,
        OverlayPanelModule,
        TableModule,
        RippleModule
    ],
    providers: [],
    templateUrl: './categories.form.widget.html',
})
export class CategoriesFormWidget implements OnInit {
    @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
    product: Products = {};
    isSubmitted: boolean = false;
    category: Categories = {};
    parents: any[];

    constructor(
        protected _events: Events,
        protected _categoriesModel: CategoriesModel) {
    }

    async ngOnInit() {
        await this.CategoriesForm.setReady();
    }

    CategoriesForm = {
        setReady: async () => {
            const parent = this.CategoriesForm;
            await parent._onNewCategory();
            await parent._setDefault();
        },
        _onNewCategory: async () => {
            this._events.on(ProductsCategoriesActions.onNewCategory, (results: any) => {
                this.product = results.selected;
                this.overlayPanel.show(results.event);
                this.parents = results.parents;
                this.parents = [{name: 'No Parent', code: ''}, ...this.parents];
            })
        },
        _setDefault: async () => {
            this.category = {label: '', parentId: ''};
        },
        onSubmit: async () => {
            this.isSubmitted = true;
            if (!this.category.label.trim().length) return;
            const onSuccess = async (response: any) => {
                await this._events.set(CategoriesFormActions.onSaved, {isSuccess: true});
                await this.CategoriesForm._setDefault();
                this.overlayPanel.hide();
                this.isSubmitted = false;
            }
            await this._categoriesModel.saveCategory(this.category, onSuccess).then(async (_: any) => {
                this.isSubmitted = false;
            })
        }
    }

}
