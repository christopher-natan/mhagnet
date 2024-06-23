import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SpinnerService} from "../services/spinner.service";
import {Strings} from "../strings";
import {Events} from "../events";
import {NotifierActions} from "../services/notifier.service";
import {firstValueFrom, Observable} from "rxjs";
import {Configs} from "../configs";

export interface RequestParam {
    path: string,
    onError?: Callback,
    onSuccess?: Callback,
    data?: any,
    noSpinner?: boolean,
    headers?: any
}

type Callback = (request: any) => void;

@Injectable()
export class Models {
    apiBase: string = Configs.apiBase;

    constructor(protected _http: HttpClient,
                protected _events: Events,
                protected _spinnerService: SpinnerService,
                protected _strings: Strings) {
    }

    public onSuccess = async (response: any, onSuccess: (arg: any) => void, type: string) => {
        if (type !== 'get') await this._events.set(NotifierActions.onSuccess, {message: response.message});
        onSuccess(response);
    }
    public onError = async (response: any, onError: (arg: any) => void) => {
        await this._events.set(NotifierActions.onError, {message: response.message});
        onError !== undefined ? onError(response) : {};
    }

    Error = {
        common: async (_: any) => {
            await this._spinnerService.hide();
            await this._events.set(NotifierActions.onError, {message: this._strings.message['errorOccurred']});
        }
    }

    Requests = {
        _resource: async (method: string, params: RequestParam) => {
            const endpoint: string = this.apiBase + params.path;
            const headers: any = this.Requests.getHeaders(params.headers);
            const noSpinner: boolean = params.noSpinner !== undefined ? params.noSpinner : false;
            const actions = {
                post:  this._http.post<any>(endpoint, params.data, {headers}),
                get:  this._http.get<any>(endpoint, params.headers),
                delete:  this._http.delete<any>(endpoint, headers)
            }
            !noSpinner ? await this._spinnerService.show() : {};
            return await firstValueFrom(actions[method]).then(async (response: any) => {
                !noSpinner ? await this._spinnerService.hide() : {};
                response.success ? await this.Requests._onSuccess(response, params, method) : await this.Requests._onError(response, params);
            }).catch(async (error: any) => this.Error.common(error));
        },
        get: async (params: RequestParam) => await this.Requests._resource('get', params),
        post: async (params: RequestParam) => await this.Requests._resource('post', params),
        delete: async (params: RequestParam) => await this.Requests._resource('delete', params),
        getHeaders: (headers?: any): HttpHeaders => {
            let options = {'Content-Type': 'application/json'};
            options = {...options, ...headers};
            return new HttpHeaders(options);
        },
        _onSuccess: async (response: any, params: RequestParam, method: string) => {
            if (method !== 'get' && !params.noSpinner) await this._events.set(NotifierActions.onSuccess, {message: response.message});
            params.onSuccess(response);
        },
        _onError: async (response: any, params: RequestParam) => {
            await this._events.set(NotifierActions.onError, {message: response.message});
            params.onError !== undefined ? params.onError(response) : {};
        }
    }
}
