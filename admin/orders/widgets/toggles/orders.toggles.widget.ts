import {Component, OnInit} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgClass, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Events} from "../../../events";
import {ToggleButtonModule} from "primeng/togglebutton";

export enum OrdersTogglesActions {
    onToggled = 'onToggled[OrdersToggles]',
}

@Component({
    selector: 'orders-toggles-widget',
    standalone: true,
    imports: [
        AvatarModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        ReactiveFormsModule,
        ToggleButtonModule,
        NgClass,
        FormsModule
    ],
    templateUrl: './orders.toggles.widget.html'
})
export class OrdersTogglesWidget implements OnInit {
    checked: boolean = false;
    holder: any = Array.from({length: 5}, (_, i) => i + 1);
    orderStatus: {} = {}

    constructor(protected _events: Events) {
        this.OrdersTogglesTable.setDefault();
    }

    async ngOnInit() {}

    OrdersTogglesTable = {
        onClickStatus: async () => {
            const status: string[] = Object.keys(this.orderStatus).filter(key => this.orderStatus[key]);
            await this._events.set(OrdersTogglesActions.onToggled, {status: status});
        },
        setDefault: () => {
            this.holder.forEach((index: string) => {
                this.orderStatus[index] = true;
            })
        },
    }
}
