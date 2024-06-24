import {Injectable} from "@angular/core";
import {Models} from "../../models/models";

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

type Callback = (request: any) => void;

@Injectable({providedIn: "root"})
export class ProductsModel extends Models {
    parentCategories: any = {};

    public findAll = async (onSuccess: Callback, onError?: Callback | undefined) => {
        const params = {path: 'product', onError: onError, onSuccess: onSuccess};
        return await this.Request.get(params);
    }

    public deleteProduct = async (product: Products, onSuccess: Callback, onError?: Callback) => {
        const params = {path: 'product/' + product.id, onError: onError, onSuccess: onSuccess, headers: {'Product-Id': product.id}};
        return await this.Request.delete(params);
    }

    public saveIsAvailable = async (product: Products, onSuccess: Callback, onError?: Callback) => {
        const params = {
            path: 'product/available',
            noSpinner: true,
            data: {isAvailable: product.isAvailable}, onError: onError, onSuccess: onSuccess, headers: {'Product-Id': product.id}
        };
        return await this.Request.post(params);
    }

    public saveProduct = async (product: Products, onSuccess: Callback, onError?: Callback) => {
        product.categories = typeof product.categories !== 'object' ? this.toArrayOfObjects(product.categories) : product.categories;
        const params = {path: 'product', data: product, onError: onError, onSuccess: onSuccess, headers: {}}
        return await this.Request.post(params);
    }

    public saveCategories = async (categories: any, productId: string, onSuccess: Callback, onError?: Callback) => {
        const params = {
            path: 'product/categories',
            data: categories, onError: onError, onSuccess: onSuccess, headers: {'Product-Id': productId}
        };
        return await this.Request.post(params);
    }

    public deleteImage = async (productId: string, image: string, onSuccess: Callback, onError?: Callback) => {
        const params = {path: 'product/image/' + image, onError: onError, onSuccess: onSuccess, headers: {'Product-Id': productId}};
        return await this.Request.delete(params);
    }

    public toArrayOfObjects = (input: string): { id: string }[] => {
        return input.split(',').map(value => ({id: value}));
    }
}
