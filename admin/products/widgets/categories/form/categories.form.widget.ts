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
import {NotifierService} from "../../../../services/notifier.service";
import {SpinnerService} from "../../../../services/spinner.service";
import {ProductsCategoriesActions} from "../products.categories.widget";

export enum CategoriesFormActions {
    onSaved = "onSavedCategories"
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
    providers: [NotifierService],
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
        protected _spinnerService: SpinnerService,
        protected _notifierService: NotifierService,
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
        Submit: {
            onClick: async () => {
                this.isSubmitted = true;
                if (this.category.label.trim().length) await this.CategoriesForm.Submit._save();
            },
            _save: async () => {
                await this._spinnerService.show();
                const success = async (response: any) => {
                    await this._notifierService.success(response.message);
                    await this._spinnerService.hide();
                    await this._events.set(CategoriesFormActions.onSaved, {isSuccess: true});
                    await this.CategoriesForm._setDefault();
                    this.overlayPanel.hide();
                    this.isSubmitted = false;
                }
                const error = async (response: any) => {
                    await this._notifierService.error(response.message);
                    await this._spinnerService.hide();
                }
                await this._categoriesModel.saveCategories(this.category).then(async (response: any) => {
                    response.success ? await success(response) : await error(response);
                }).catch(async (response: any) => {
                    await this._notifierService.error(response.message);
                    await this._spinnerService.hide();
                });
            }
        }
    }

}
