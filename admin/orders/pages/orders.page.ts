import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
    templateUrl: './orders.page.html',
    providers: [MessageService]
})
export class OrdersPage implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}
