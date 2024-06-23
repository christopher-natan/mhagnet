import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CustomersRoutingModule} from './customers.routing.module';
import {TableModule} from 'primeng/table';
import {FileUploadModule} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from "primeng/sidebar";
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {BlockUIModule} from "primeng/blockui";
import {MenuModule} from "primeng/menu";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CustomersPage} from "./pages/customers.page";
import {ChartModule} from "primeng/chart";
import {MultiSelectModule} from "primeng/multiselect";
import {SliderModule} from "primeng/slider";
import {DividerModule} from "primeng/divider";
import {CalendarModule} from "primeng/calendar";
import {AvatarModule} from "primeng/avatar";

import {CustomersUpdateWidget} from "./widgets/update/customers.update.widget";
import {CustomersListTableWidget} from "./widgets/table/list/customers.list.table.widget";
import {CustomersDetailsWidget} from "./widgets/details/customers.details.widget";
import {SpinnerWidget} from "../widgets/spinner/spinner.widget";
import {CustomersHistoryTableWidget} from "./widgets/table/history/customers.history.table.widget";

@NgModule({
    imports: [
        CommonModule,
        CustomersRoutingModule,
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
        TabViewModule,
        BlockUIModule,
        MenuModule,
        ProgressSpinnerModule,
        ChartModule,
        MultiSelectModule,
        SliderModule,
        CustomersHistoryTableWidget,
        DividerModule,
        CalendarModule,
        AvatarModule,

        CustomersUpdateWidget,
        CustomersListTableWidget,
        CustomersDetailsWidget,
        SpinnerWidget,
    ],
    declarations: [CustomersPage]
})
export class CustomersModule {
}
