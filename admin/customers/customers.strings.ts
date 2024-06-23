import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class CustomersStrings {
    message: any = {};

    constructor() {
        this.message = {
            notifyUploadError: 'Image upload error',
            notifyNoDAllowedDeleteImage: "You can't delete this image.",
            notifyNetworkError: 'Issue with your network',
            notifyCheckARequired: 'Please check the required fields',
            dialogDeleteAllProducts: 'Are you sure you want to delete ALL the selected product?',
            dialogDeleteProduct: 'Are you sure you want to delete this product?'
        }
    }
}
