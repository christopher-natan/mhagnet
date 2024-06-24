import {Injectable} from "@angular/core";
import {Events} from "../events";
import {MessageService} from "primeng/api";

export enum NotifierActions {
    onSuccess = "onSuccess[Notifier]",
    onError = "onError[Notifier]",
}

@Injectable({
    providedIn: 'root'
})
export class NotifierService {
    constructor(
        protected _messageService: MessageService,
        protected _events: Events) {
        //this._onNotify();
    }

    public success = async (detail: string) => {
        this._messageService.add({severity: 'success', summary: 'Successful', detail: detail, life: 3000});

    }

    public error = async (detail: string) => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: detail, life: 3000});
    }

    private _onNotify = () => {
        this._events.on(NotifierActions.onSuccess, async (results: any) => await this.success(results.message));
        this._events.on(NotifierActions.onError, async (results: any) => await this.error(results.message));
    }
}
