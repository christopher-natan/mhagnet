import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import {PosModel} from "../../models/pos.model";
import {PosActions} from "../../pages/pos.page";
import {Events} from "../../../events";

@Component({
    selector: 'pos-delivery-widget',
    standalone: true,
    imports: [
        ButtonModule,
        CalendarModule,
        DropdownModule,
        RippleModule,
        SharedModule,
        ToolbarModule,
        FormsModule
    ],
    templateUrl: './pos.delivery.widget.html',
})
export class PosDeliveryWidget implements OnInit {
    delivery: any = {}

    constructor(protected _events: Events,
                private _posModel: PosModel) {
    }

    async ngOnInit(): Promise<void> {
        await this.PosDelivery.setReady();
        await this.PostPage.setReady();
    }

    PosDelivery = {
        setReady: async () => {
            const parent = this.PosDelivery;
            await parent.setDefault();
        },
        setDefault: async () => {
            this.delivery = this._posModel.posData['delivery'];
            this.delivery.deliveryDate = new Date(this.delivery.deliveryDate);
        },
        onSelect: async (value: any) => {
            this.delivery.deliveryDate = new Date(value);
            await this._posModel.saveLocalStorage('delivery', this.delivery);
        }
    }

    PostPage = {
        setReady: async () => {
            const parent = this.PostPage;
            await parent._onCanceled();
        },
        _onCanceled: async () => {
            this._events.on(PosActions.onCanceled, async (_: any) => {
                await this.PosDelivery.setDefault();
            });
        },
    }
}
