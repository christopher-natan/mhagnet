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
import {CategoriesFormActions, CategoriesFormWidget} from "./form/categories.form.widget";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ToolbarModule} from "primeng/toolbar";

export enum ProductsCategoriesActions {
    onSaved = "onSaved[ProductsCategories]",
    onNewCategory = "onNewCategory[ProductsCategories]",
    onSetSelected = "onSetSelected[ProductsCategories]"
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
    providers: [],
    templateUrl: './products.categories.widget.html',
})
export class ProductsCategoriesWidget implements OnInit {
    @Input() isStandalone: boolean = false;
    categories: TreeNode[] = [];
    product: Products = {};
    checked: TreeNode[] = [];
    selected: any;
    parents: any[] = [];
    selectedNodes: string;
    isSubmitted: boolean;

    constructor(
        protected _events: Events,
        protected _categoriesModel: CategoriesModel,
        protected _productsModel: ProductsModel) {
    }

    async ngOnInit() {
        await this.ProductsCategories.setReady();
        await this.ProductsTable.setReady();
        await this.CategoriesForm.setReady();
    }

    ProductsCategories = {
        setReady: async () => {
            const parent = this.ProductsCategories;
            if (!this.isStandalone) await parent.setCategories();
        },
        checkNodes: (parent: TreeNode, nodes: TreeNode[], selected: Array<any>) => {
            if (!nodes) return;
            for (let node of nodes) {
                const key: string = node.key;
                if (selected.indexOf(key) >= 0) {
                    !this.isStandalone ? this.checked.push(node) : {};
                    parent !== undefined ? parent.expanded = true : {}
                }
                parent === undefined ? this.parents.push(node) : {}
                node.children ? this.ProductsCategories.checkNodes(node, node.children, selected) : {}
            }
        },
        onNodeSelect: async ($event?: TreeNodeSelectEvent) => {
            this.selected = this.checked.map((item: any) => item.key);
            this.selectedNodes = this.selected.join(',');
            await this._events.set(ProductsCategoriesActions.onSetSelected, {selected: this.selectedNodes, isStandalone: this.isStandalone});
        },
        onClickNewCategory: async ($event: MouseEvent) => {
            const parents = this.parents.map((item: { label: any; code: any; }) => {
                return {name: item.label, code: item.code};
            });
            await this._events.set(ProductsCategoriesActions.onNewCategory, {selected: this.product, parents: parents, event: $event});
        },
        setCategories: async () => {
            const onSuccess = (results: any) => {
                this.categories = this._categoriesModel.format(results.data) as TreeNode[];
                this._productsModel.parentCategories = this.categories;
            }
            this._categoriesModel.findAll(onSuccess).then((_: any) => {
            });
        },
        onSubmit: async () => {
            this.isSubmitted = true;
            const onSuccess = async (_: any) => {
                this.isSubmitted = false;
                await this._events.set(ProductsCategoriesActions.onSaved, {categories: this.selected});
            }
            await this._productsModel.saveCategories({categories: this.selected}, this.product.id, onSuccess).then(async (_: any) => {
            })
        },
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._onRowSelected();
            await parent._onClickedAddNew();
        },
        _onRowSelected: async () => {
            if (this.isStandalone) return;
            this._events.on(ProductsTableActions.onRowSelected, (results: any) => {
                this.product = results.selected;
                let categories = this.product.categories;
                categories = categories.map((item: { id: any; }) => item.id);
                this.checked = [];
                this.ProductsCategories.checkNodes(undefined, this.categories, categories);
                this.ProductsCategories.onNodeSelect();
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
}
