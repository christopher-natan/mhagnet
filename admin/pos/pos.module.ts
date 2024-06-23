import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PosRoutingModule} from './pos.routing.module';
import {TableModule} from 'primeng/table';
import {FileUploadModule} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';

import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from "primeng/sidebar";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {BlockUIModule} from "primeng/blockui";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PosPage} from "./pages/pos.page";
import {DividerModule} from "primeng/divider";
import {CalendarModule} from "primeng/calendar";
import {AvatarModule} from "primeng/avatar";
import {DataViewModule} from "primeng/dataview";
import {ProductsListWidget} from "../products/widgets/list/products.list.widget";
import {PosCustomerWidget} from "./widgets/customer/pos.customer.widget";
import {PosInvoiceWidget} from "./widgets/invoice/pos.invoice.widget";
import {PosDeliveryWidget} from "./widgets/delivery/pos.delivery.widget";
import {SpinnerWidget} from "../widgets/spinner/spinner.widget";
import {PosItems} from "./widgets/items/pos.items.widget";

@NgModule({
    imports: [
        CommonModule,
        PosRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        InputNumberModule,
        DialogModule,
        SidebarModule,
        SplitterModule,
        TabViewModule,
        BlockUIModule,
        ProgressSpinnerModule,
        DividerModule,
        CalendarModule,
        AvatarModule,
        DataViewModule,
        ProductsListWidget,
        PosCustomerWidget,
        PosInvoiceWidget,
        PosDeliveryWidget,
        SpinnerWidget,
        PosItems,
    ],
    declarations: [PosPage]
})
export class PosModule {
}
