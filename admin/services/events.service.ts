import {Injectable} from "@angular/core";
import {Events} from "../events";
import {MessageService} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    constructor(protected _messageService: MessageService, protected _events: Events) {
    }
}
