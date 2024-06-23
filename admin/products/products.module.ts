import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products.routing.module';

import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import {ProductsPage} from "./pages/products.page";
import {SidebarModule} from "primeng/sidebar";
import {SplitterModule} from "primeng/splitter";
import {ProductsTableWidget} from "./widgets/table/products.table.widget";
import {EditFormWidget} from "./widgets/form/edit/edit.form.widget";
import {TabViewModule} from "primeng/tabview";
import {UploadImageWidget} from "./widgets/image/upload/upload.image.widget";
import {ListImageWidget} from "./widgets/image/list/list.image.widget";
import {BlockUIModule} from "primeng/blockui";

import {MenuModule} from "primeng/menu";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ProductsDetailsWidget} from "./widgets/details/products.details.widget";
import {SpinnerWidget} from "../widgets/spinner/spinner.widget";
import {ProductsCategoriesWidget} from "./widgets/categories/products.categories.widget";
import {AddFormWidget} from "./widgets/form/add/add.form.widget";


@NgModule({
    imports: [
        CommonModule,
        ProductsRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        SidebarModule,
        SplitterModule,
        ProductsTableWidget,
        EditFormWidget,
        TabViewModule,
        UploadImageWidget,
        ListImageWidget,
        BlockUIModule,
        MenuModule,
        ProgressSpinnerModule,
        ProductsDetailsWidget,
        SpinnerWidget,
        ProductsCategoriesWidget,
        AddFormWidget
    ],
    declarations: [ProductsPage]
})
export class ProductsModule { }
