import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SpinnerService} from "../services/spinner.service";
import {Strings} from "../strings";
import {Events} from "../events";
import {NotifierActions} from "../services/notifier.service";
import {firstValueFrom} from "rxjs";
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

    Error = {
        common: async (_: any) => {
            await this._spinnerService.hide();
            await this._events.set(NotifierActions.onError, {message: this._strings.message['errorOccurred']});
        }
    }

    Request = {
        _resource: async (method: string, params: RequestParam) => {
            const endpoint: string = this.apiBase + params.path;
            const headers: any = this.Request.getHeaders(params.headers);
            const noSpinner: boolean = params.noSpinner !== undefined ? params.noSpinner : false;
            const actions = {
                post: this._http.post<any>(endpoint, params.data, {headers}),
                get: this._http.get<any>(endpoint, params.headers),
                delete: this._http.delete<any>(endpoint, headers)
            }
            !noSpinner ? await this._spinnerService.show() : {};
            return await firstValueFrom(actions[method]).then(async (response: any) => {
                !noSpinner ? await this._spinnerService.hide() : {};
                response.success ? await this.Request._onSuccess(response, params, method) : await this.Request._onError(response, params);
            }).catch(async (error: any) => this.Error.common(error));
        },
        get: async (params: RequestParam) => await this.Request._resource('get', params),
        post: async (params: RequestParam) => await this.Request._resource('post', params),
        delete: async (params: RequestParam) => await this.Request._resource('delete', params),
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

    public validate = (data: any, schema: any, parentKey: string = '') => {
        const errors: string[] = [];
        const isEmptyOrZero = (value: any): boolean => {
            return value === null || value === undefined || value === '' || value === 0;
        }
        for (const key in schema) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            const value = data[key];
            const fieldSchema = schema[key];
            if (fieldSchema.required && isEmptyOrZero(value)) {
                errors.push(`${fullKey} is required and cannot be empty or zero.`);
            }
            if (fieldSchema.schema && value !== undefined && value !== null) {
                const nestedResult = this.validate(value, fieldSchema.schema, fullKey);
                errors.push(...nestedResult.errors);
            }
        }
        return {isValid: errors.length === 0, errors};
    }
}
