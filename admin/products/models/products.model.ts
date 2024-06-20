import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Configs} from "app/configs";

export interface Products {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    categories?: any;
    inventoryStatus?: number;
    images?: any;
    rating?: number;
    isAvailable?: number;
    isFeatured?: number;
    placeholder?: any;
}

@Injectable({providedIn: "root"})
export class ProductsModel {
    _url: string = Configs.apiBase;
    parentCategories: any = {};

    constructor(protected http: HttpClient) {
    }

    public findAll = async () => {
        return await firstValueFrom(this.http.get<any>(this._url + 'product')).catch((result) => {
            return result;
        });
    }

    public saveProduct = async (product: Products) => {
        product.categories = typeof product.categories !== 'object'
            ? this.toArrayOfObjects(product.categories)
            : product.categories;
        const url = this._url + 'product';
        const headers = this._getHeaders();
        return await firstValueFrom(this.http.post(url, product, {headers})).catch((result) => {
            return result;
        });
    }

    public saveIsAvailable = async (product: Products) => {
        const url = this._url + 'product/available';
        const headers = this._getHeaders(product.id);
        return await firstValueFrom(this.http.post(url, {isAvailable: product.isAvailable}, {headers})).catch((result) => {
            return result;
        });
    }

    public saveCategories = async (categories: [], productId: string) => {
        const url = this._url + 'product/categories';
        const headers = this._getHeaders(productId);
        return await firstValueFrom(this.http.post(url, {categories: categories}, {headers})).catch((result) => {
            return result;
        });
    }

    public deleteProduct = async (product: Products) => {
        const url = this._url + 'product/' + product.id;

        const headers = this._getHeaders(product.id);
        return await firstValueFrom(this.http.delete(url, {headers})).catch((result) => {
            return result;
        });
    }

    public deleteImage = async (productId: string, image: string) => {
        const url = this._url + 'product/image/' + image;
        const headers = this._getHeaders(productId);
        return await firstValueFrom(this.http.delete(url, {headers})).catch((result) => {
            return result;
        });
    }

    public toArrayOfObjects = (input: string): { id: string }[] => {
        return input.split(',').map(value => ({id: value}));
    }

    private _getHeaders = (productId?: string) => {
        return new HttpHeaders({'Content-Type': 'application/json', 'Product-Id': productId ? productId : ''});
    }

    public isValidForm = (product: Products) => {
        product = {...{name: '', description: '', price: null, quantity: null, categories: ''}, ...product};
        const errors = [];
        for (const key in product) {
            const value = product[key];
            if (value === null || value === undefined || value === '') {
                errors.push(key);
            }
        }
        return !errors.length;
    }
}
