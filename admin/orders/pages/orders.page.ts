import {Component, OnDestroy, OnInit} from '@angular/core';
import {Events} from "../../events";
import {MessageService} from "primeng/api";

@Component({
    templateUrl: './orders.page.html',
    providers: [MessageService]
})
export class OrdersPage implements OnInit, OnDestroy {

    constructor(protected _events: Events) {
    }

    ngOnInit(): void {
    }

    async ngOnDestroy() {
        await this._events.unsubscribe();
    }
}
