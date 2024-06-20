import {DocumentController} from "./controllers/document_controller";

/**
 * Routes only
 */
export class Routes {
    _documentController: DocumentController = new DocumentController();
    constructor(private app: any) {
        app.post('/document/upload',this._documentController.upload);
        app.get('/document/test',this._documentController.test);
    }
}
