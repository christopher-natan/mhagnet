import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrdersRoutingModule} from './orders.routing.module';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {DropdownModule} from 'primeng/dropdown';
import {SplitterModule} from "primeng/splitter";
import {TabViewModule} from "primeng/tabview";
import {OrdersPage} from "./pages/orders.page";
import {OrdersItemsTableWidget} from "./widgets/table/items/orders.items.table.widget";
import {DividerModule} from "primeng/divider";
import {CalendarModule} from "primeng/calendar";
import {AvatarModule} from "primeng/avatar";
import {OrdersCustomerWidget} from "./widgets/customer/orders.customer.widget";
import {OrdersInvoiceWidget} from "./widgets/invoice/orders.invoice.widget";
import {OrdersUpdateWidget} from "./widgets/update/orders.update.widget";
import {CustomersListTableWidget} from "../customers/widgets/table/list/customers.list.table.widget";
import {SpinnerWidget} from "../widgets/spinner/spinner.widget";
import {OrdersTransactionsTable} from "./widgets/table/transactions/orders.transactions.table.widget";

@NgModule({
    imports: [
        CommonModule,
        OrdersRoutingModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        DropdownModule,
        SplitterModule,
        TabViewModule,
        OrdersTransactionsTable,
        OrdersItemsTableWidget,
        DividerModule,
        CalendarModule,
        AvatarModule,
        OrdersCustomerWidget,
        OrdersInvoiceWidget,
        OrdersUpdateWidget,
        CustomersListTableWidget,
        SpinnerWidget,
    ],
    declarations: [OrdersPage]
})
export class OrdersModule {
}
