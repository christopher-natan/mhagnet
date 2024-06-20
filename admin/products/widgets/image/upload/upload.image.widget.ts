import {Component, OnInit} from '@angular/core';
import {FileUploadModule} from "primeng/fileupload";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {BadgeModule} from "primeng/badge";
import {Events} from "app/events";
import {Configs} from "app/configs";
import {ProductsStrings} from "../../../products.strings";
import {ProductsTableActions} from "../../table/products.table.widget";
import {Products} from "../../../models/products.model";
import {HttpHeaders} from "@angular/common/http";
import {NotifierService} from "../../../../services/notifier.service";
import {SpinnerService} from "../../../../services/spinner.service";

export enum UploadImageActions {
    onUploadSuccess = 'onUploadSuccess',
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
    providers: [NotifierService]
})
export class UploadImageWidget implements OnInit {
    protected readonly Configs = Configs;
    uploadedImages: any[] = [];
    headers: HttpHeaders = new HttpHeaders({'Product-Id': ''});
    product: Products = {};

    constructor(protected _events: Events,
                protected _productsString: ProductsStrings,
                protected _notifierService: NotifierService,
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
                await this._notifierService.error(body.message)
                await this._events.set(UploadImageActions.onUploadSuccess, {isSuccess: false});
            }
            if (body.success) {
                await this._notifierService.success(body.message)
                await this._events.set(UploadImageActions.onUploadSuccess, {
                    isSuccess: true,
                    images: body.data.images
                });
            }
            await this._spinnerService.hide();
        },
        onError: async ($event: any, fileUpload: any) => {
            await this._spinnerService.hide();
            await this._notifierService.error(this._productsString.message['notifyUploadError'])
            await this._events.set(UploadImageActions.onUploadSuccess, {isSuccess: false});
        },
        onBeforeUpload: async () => {
            await this._spinnerService.show();
        }
    }
}
