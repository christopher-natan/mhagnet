import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {ConfirmationService, Message, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {Events} from "app/events";
import {TieredMenuModule} from "primeng/tieredmenu";
import {MegaMenuModule} from "primeng/megamenu";
import {MenubarModule} from "primeng/menubar";
import {MenuModule} from "primeng/menu";
import {RippleModule} from "primeng/ripple";
import {ProductsTableActions} from "app/products/widgets/table/products.table.widget";
import {Products, ProductsModel} from "app/products/models/products.model";
import {DialogModule} from "primeng/dialog";
import {UploadImageActions} from "app/products//widgets/image/upload/upload.image.widget";
import {ProductsStrings} from "../../../products.strings";
import {BytesConvertPipe} from "../../../../pipes/bytes.convert";
import {ProductImagePipe} from "../../../../pipes/product.image.pipe";
import {SpinnerService} from "../../../../services/spinner.service";
import {NotifierService} from "../../../../services/notifier.service";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {MessagesModule} from "primeng/messages";
import {ImageModule} from "primeng/image";

export enum ListImageActions {
    onDeleted = 'onImageDeleted',
}

@Component({
    selector: 'list-image-widget',
    standalone: true,
    imports: [
        ButtonModule,
        CurrencyPipe,
        SharedModule,
        TableModule,
        TieredMenuModule,
        MegaMenuModule,
        MenubarModule,
        MenuModule,
        RippleModule,
        NgForOf,
        DialogModule,
        NgIf,
        BytesConvertPipe,
        ProductImagePipe,
        ConfirmPopupModule,
        MessagesModule,
        ImageModule
    ],
    providers: [NotifierService, ConfirmationService],
    templateUrl: './list.image.widget.html'
})
export class ListImageWidget implements OnInit {
    images: any = [];
    product: Products;
    messages: Message[] | undefined;

    constructor(protected _events: Events,
                protected _productsModel: ProductsModel,
                protected _notifierService: NotifierService,
                protected _spinnerService: SpinnerService,
                protected _confirmationService: ConfirmationService,
                protected _productsString: ProductsStrings) {
    }

    async ngOnInit() {
        await this.ProductsTable.setReady();
        await this.ProductsUploadImage.setReady();
    }

    ProductsTable = {
        setReady: async () => {
            const parent = this.ProductsTable;
            await parent._onRowSelected();
        },
        _onRowSelected: async () => {
            this._events.on(ProductsTableActions.onRowSelected, async (result: any) => {
                this.images = result.selected.images;
                this.product = result.selected;
                await this.ProductsListImage.setMessage();
            });
        }
    }

    ProductsUploadImage = {
        setReady: async () => {
            const parent = this.ProductsUploadImage;
            await parent._onUploaded();
        },
        _onUploaded: async () => {
            this._events.on(UploadImageActions.onUploadSuccess, async (results: any) => {
                if (results.isSuccess) {
                    this.images = [...results.images, ...this.images];
                    await this.ProductsListImage.setMessage();
                }
            });
        }
    }

    ProductsListImage = {
        onClick: async ($event: { target: any; }, name: string) => {
            const parent = this.ProductsListImage;
            this._confirmationService.confirm({
                key: name,
                target: $event.target || new EventTarget,
                message: `Are you sure that you want to delete?`,
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    await parent._confirmed(name);
                },
                reject: () => {
                }
            });
        },
        _confirmed: async (name: string) => {
            if (this.images.length < 2) return this._notifierService.error(this._productsString.message['notifyNoDAllowedDeleteImage']);

            const success = async (response: any, name: string) => {
                this.images = this.images.filter((item: any) => item.name !== name);
                await this._events.set(ListImageActions.onDeleted, {images: this.images});
                await this._notifierService.success(response.message);
            }
            const error = async (response: any) => {
                await this._spinnerService.hide();
                await this._notifierService.error(response.message);
            }
            await this._spinnerService.show();
            await this._productsModel.deleteImage(this.product.id, name).then(async (response: any) => {
                await this._spinnerService.hide();
                response.success ? await success(response, name)
                    : await error(response);

            });
        },
        setMessage: async () => {
            this.messages = this.images.length <= 0 ? [{severity: 'info', detail: 'Please add photos to this product'}] : [];
        }
    }
}
