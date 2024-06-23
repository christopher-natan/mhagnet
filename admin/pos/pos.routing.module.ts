import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {PosPage} from "./pages/pos.page";

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PosPage }
	])],
	exports: [RouterModule]
})
export class PosRoutingModule { }
