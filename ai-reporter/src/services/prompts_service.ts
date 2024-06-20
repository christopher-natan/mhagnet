import fs from "fs";
import {Configs} from "../configs";
import {Observable, Subscriber} from "rxjs";

export class PromptsService {
    public get = (prompt: string): Observable<any> => {

        return new Observable((subscriber: Subscriber<any>) => {
            fs.readFile(Configs.promptsPath + prompt.toString(), 'utf8', (err, resBuffer) => {
                if (err) return subscriber.error(err)
                subscriber.next(JSON.parse(resBuffer));
            })
        });
    }
}
