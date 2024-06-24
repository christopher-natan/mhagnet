import {Injectable} from "@angular/core";
import {Events} from "../events";
import {SpinnerActions} from "../widgets/spinner/spinner.widget";

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
    constructor(protected _events: Events) {
    }

    public show = async () => {
        await this._events.set(SpinnerActions.onShowed, true);
    }

    public hide = async () => {
        await this._events.set(SpinnerActions.onShowed, false);
    }
}
