import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProductsPage} from "./pages/products.page";

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProductsPage }
	])],
	exports: [RouterModule]
})
export class ProductsRoutingModule { }
