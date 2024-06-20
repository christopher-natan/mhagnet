import {Observable, Subscriber} from "rxjs";
import {DocumentService} from "../services/document_service";
import * as dotenv from 'dotenv';
import {OpenAiService} from "../services/openai_service";
import {ErrorService} from "../services/error_service";
import {ResponseService} from "../services/response_service";
import {DebugService} from "../services/debug_service";
import {HostService} from "../services/host_service";
import {Configs} from "../configs";

dotenv.config();

export class DocumentController {
    _documentService: DocumentService = new DocumentService();
    _openAiService: OpenAiService = new OpenAiService();
    _responseService: ResponseService = new ResponseService();
    _hostService: HostService = new HostService();
    _results: any = '';
    _documentType?: { type: '' };
    _res: any;
    _req: any;
    _headers = [];

    constructor() {
        this._onResponse();
    }

    public test = async (req: any, res: any, next: any) => {
       return res.json({success: true});
    }

    public upload = async (req: any, res: Object, next: any) => {
        this._res = res;
        this._req = req;
        this._headers = req['headers']['information'].split('|');

        return await this._hostService.upload(req, res, next).then((filename: any) => this.extract(filename));
    }

    public extract = (file: string) => {
        this._openAiService.setRes(this._res);
        this._observeDocument(file);
    }

    protected _observeDocument = (file: string) => {
        const parent: DocumentController = this;
        const observable: Observable<any> = new Observable((subscriber: Subscriber<any>) => {
            subscriber.next(this._documentService.parseDoc(Configs.documentsPath + file, false, this._res));
        });
        observable.subscribe({
            next(data: any) {
                data.subscribe((results: any) => {
                    parent._openAiService.chat(parent._headers, parent._results, 'information.json', file);
                });
            },
            complete() {
            },
            error(error) {
                parent._res.json(ErrorService.documentError(error));
            },
        }).unsubscribe();
    }

    protected _onResponse = (): void => {
        const parent: DocumentController = this;
        try {
            this._openAiService.onResponse.subscribe((response: any) => {
                if (response.status == 'complete') {
                    this._res.json(this._responseService.format(response));
                    DebugService.printAIResponse(response);
                }
            });
        } catch (error: any) {
            this._res.json(ErrorService.responseError(error.toString()));
        }
    }

}
