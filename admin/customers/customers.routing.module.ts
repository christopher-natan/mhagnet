import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CustomersPage} from "./pages/customers.page";

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CustomersPage }
	])],
	exports: [RouterModule]
})
export class CustomersRoutingModule { }
