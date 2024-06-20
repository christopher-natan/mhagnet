import pdfParse from "pdf-parse";
import axios, {AxiosResponse} from "axios";
import {Observable, Subscriber} from "rxjs";
import {ErrorService} from "./error_service";
import fs from "fs";

export class DocumentService {
    public parseDoc = (urlOrPath: string, isUrl: boolean =  false, res: any): Observable<any> => {
        return isUrl ? this._parseFromUrl(urlOrPath, res) : this._parseFromHost(urlOrPath, res);
    }

    protected _parseFromUrl = (url: string, res: any) => {
        return new Observable((subscriber: Subscriber<any>) => {
            try {
                axios({
                    method: 'get', url: url.trim(), responseType: 'arraybuffer',
                }).then(async (response: AxiosResponse<any, any>): Promise<void> => {
                    const responseData = response.data;
                    subscriber.next(await pdfParse(responseData, {version: "v2.0.550"}));
                    subscriber.complete();
                }).catch((error: any) => {
                    res.json(ErrorService.requestError(error));
                })
            } catch (error: any) {
                res.json(ErrorService.requestError({error: 'The document source url is invalid.'}));
            }
        });
    }

    protected _parseFromHost = (path: string, res: any) => {
        return new Observable( (subscriber: Subscriber<any>) => {
            try {
                const dataBuffer = fs.readFileSync(path);
                pdfParse(dataBuffer, {version: "v2.0.550"}).then((parsed) => {
                    subscriber.next(parsed);
                    subscriber.complete();
                });

            } catch (error: any) {
                res.json(ErrorService.requestError({error: 'The document source url is invalid.'}));
            }
        });
    }

}
