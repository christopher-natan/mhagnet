import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {OrdersPage} from "./pages/orders.page";

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrdersPage }
	])],
	exports: [RouterModule]
})
export class OrdersRoutingModule { }
