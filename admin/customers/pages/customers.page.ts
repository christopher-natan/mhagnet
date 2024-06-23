import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Events} from "../../events";


@Component({
    templateUrl: './customers.page.html',
    providers: [MessageService]
})
export class CustomersPage implements OnInit, OnDestroy {

    constructor(protected _events: Events) {}
    ngOnInit(): void {
    }

    async ngOnDestroy() {
        await this._events.unsubscribe();
    }

}
