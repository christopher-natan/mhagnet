import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class PosStrings {
    message: any = {};

    constructor() {
        this.message = {
            orderPlacedSuccess: 'Order has been placed successfully.',
        }
    }
}
