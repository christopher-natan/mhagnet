import {Component, OnInit} from '@angular/core';
import {FileUploadModule} from "primeng/fileupload";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {BadgeModule} from "primeng/badge";
import {Events} from "app/events";
import {Configs} from "app/configs";
import {ProductsTableActions} from "../../table/products.table.widget";
import {Products} from "../../../models/products.model";
import {HttpHeaders} from "@angular/common/http";
import {SpinnerService} from "../../../../services/spinner.service";
import {Strings} from "../../../../strings";
import {NotifierActions} from "../../../../widgets/spinner/spinner.widget";

export enum UploadImageActions {
    onUploadSuccess = 'onUploadSuccess[UploadImage]',
}

@Component({
    selector: 'upload-image-widget',
    standalone: true,
    imports: [
        FileUploadModule,
        NgForOf,
        NgIf,
        SharedModule,
        ToastModule,
        BadgeModule,
        NgClass
    ],
    templateUrl: './upload.image.widget.html',
    providers: []
})
export class UploadImageWidget implements OnInit {
    protected readonly Configs = Configs;
    uploadedImages: any[] = [];
    headers: HttpHeaders = new HttpHeaders({'Product-Id': ''});
    product: Products = {};

    constructor(protected _events: Events,
                protected _strings: Strings,
                protected _spinnerService: SpinnerService) {
    }

    async ngOnInit() {
        await this.ProductsTable.setReady();
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._onRowSelected();
        },
        _onRowSelected: async () => {
            this._events.on(ProductsTableActions.onRowSelected, (results: any) => {
                this.product = {...results.selected};
                this.headers = new HttpHeaders({'Product-Id': this.product.id});
            })
        }
    }

    UploadImage = {
        onUpload: async ($event: any) => {
            const body = $event.originalEvent.body;
            if (body.error) {
                await this.UploadImage.onError({}, {}, body.message);
            }
            if (body.success) {
                await this._spinnerService.hide();
                await this._events.set(NotifierActions.onSuccess, {message: body.message});
                await this._events.set(UploadImageActions.onUploadSuccess, {
                    isSuccess: true,
                    images: body.data.images
                });
            }
        },
        onError: async ($event: any, fileUpload: any, message?: any) => {
            await this._spinnerService.hide();
            await this._events.set(NotifierActions.onError, {message: message === undefined ? this._strings.message['errorOccurred'] : message});
        },
        onBeforeUpload: async () => {
            await this._spinnerService.show();
        }
    }
}
