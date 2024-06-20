import {Component, Input, OnInit} from '@angular/core';
import {TreeModule, TreeNodeSelectEvent} from "primeng/tree";
import {TreeNode} from "primeng/api";
import {Products, ProductsModel} from "app/products/models/products.model";
import {CategoriesModel} from "app//categories/models/categories.model";
import {ProductsTableActions} from "app/products/widgets/table/products.table.widget";
import {Events} from "app/events";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgClass, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TableModule} from "primeng/table";
import {RippleModule} from "primeng/ripple";
import {SpinnerService} from "../../../services/spinner.service";
import {NotifierService} from "../../../services/notifier.service";
import {CategoriesFormActions, CategoriesFormWidget} from "./form/categories.form.widget";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ToolbarModule} from "primeng/toolbar";

export enum ProductsCategoriesActions {
    onSaved = "onSavedCategory",
    onNewCategory = "onNewCategory",
    onSetSelected = "onSetSelectedCategory"
}

@Component({
    selector: 'products-categories-widget',
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
        RippleModule,
        CategoriesFormWidget,
        ScrollPanelModule,
        ToolbarModule
    ],
    providers: [NotifierService],
    templateUrl: './products.categories.widget.html',
})
export class ProductsCategoriesWidget implements OnInit {
    @Input() standalone: boolean = false;
    categories: TreeNode[] = [];
    product: Products = {};
    checked: TreeNode[] = [];
    selected: any;
    parents: any[] = [];
    input: string;
    isSubmitted: boolean;

    constructor(
        protected _events: Events,
        protected _spinnerService: SpinnerService,
        protected _notifierService: NotifierService,
        protected _categoriesModel: CategoriesModel,
        protected _productsModel: ProductsModel) {
    }

    async ngOnInit() {
        await this.ProductsCategories.setReady();
        await this.ProductsTable.setReady();
        await this.CategoriesForm.setReady();
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._onRowSelected();
            await parent._onClickedAddNew();
        },
        _onRowSelected: async () => {
            if(this.standalone) return;
            this._events.on(ProductsTableActions.onRowSelected, (results: any) => {
                this.product = results.selected;
                let categories = this.product.categories;
                categories = categories.map((item: { id: any; }) => item.id);
                this.checked = [];
                this.ProductsCategories.checkNodes(undefined, this.categories, categories);
                this.ProductsCategories.setSelected();
            })
        },
        _onClickedAddNew: async () => {
            this._events.on(ProductsTableActions.onClickedAddNew, (_: any) => {
               this.categories = this._productsModel.parentCategories;
            })
        }
    }

    CategoriesForm = {
        setReady: async () => {
            const parent = this.CategoriesForm;
            await parent._onSaved();
        },
        _onSaved: async () => {
            this._events.on(CategoriesFormActions.onSaved, async (_: any) => {
                await this.ProductsCategories.setCategories();
            })
        }
    }

    ProductsCategories = {
        setReady: async () => {
            const parent = this.ProductsCategories;
            if(!this.standalone) await parent.setCategories();
        },
        checkNodes: (parent: TreeNode, nodes: TreeNode[], selected: Array<any>) => {
            if (!nodes) return;
            for (let node of nodes) {
                const key: string = node.key;
                if (selected.indexOf(key) >= 0) {
                    !this.standalone ? this.checked.push(node) : {};
                    parent !== undefined ? parent.expanded = true : {}
                }
                parent === undefined ? this.parents.push(node) : {}
                node.children ? this.ProductsCategories.checkNodes(node, node.children, selected) : {}
            }
        },
        setSelected: async ($event?: TreeNodeSelectEvent) => {
            this.selected = this.checked.map((item: any) => item.key);
            this.input = this.selected.join(',');
            await this._events.set(ProductsCategoriesActions.onSetSelected, {input: this.input});
        },
        setCategories: async () => {
            this._categoriesModel.getCategories().then((categories) => {
                this.categories = categories;
                this._productsModel.parentCategories = this.categories;
            });
        },
        Submit: {
            onClick: async () => {
                this.isSubmitted = true;
                if (this.selected.length) await this.ProductsCategories.Submit._save();
            },
            _save: async () => {
                await this._spinnerService.show();
                const success = async (response: any) => {
                    await this._notifierService.success(response.message);
                    await this._spinnerService.hide();
                    await this._events.set(ProductsCategoriesActions.onSaved, {categories: this.selected});
                }
                const error = async (response: any) => {
                    await this._notifierService.error(response.message);
                }
                await this._productsModel.saveCategories(this.selected, this.product.id).then(async (response: any) => {
                    response.success ? await success(response) : await error(response);
                }).catch(async (_: any) => {
                    /*await this._notifierService.error(this._productsStrings.message['notifyNetworkError']);*/
                    await this._spinnerService.hide();
                });
            },
        },
        onSetNewCategory: async ($event: MouseEvent) => {
            const parents = this.parents.map((item: { label: any; code: any; }) => {
                return {name: item.label, code: item.code};
            });
            await this._events.set(ProductsCategoriesActions.onNewCategory, {selected: this.product, parents: parents, event: $event});
        }
    }
}
