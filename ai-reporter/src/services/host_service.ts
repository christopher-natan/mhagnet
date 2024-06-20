import fs from "fs";
import {AppUtil} from "../utils/app_util";
import {Configs} from "../configs";
import formidable from "formidable";

export class HostService {
    _documentFile: string = '';
    _id: string = '';

    upload = async (req: any, res: any, next: any) => {
        const form = formidable({
            uploadDir:  Configs.documentsPath,
        });
        try {
            return await form.parse(req).then(async (files) => await this._toHost(res, files[1]));
        } catch (err: any) {
            res.writeHead(err.httpCode || 400, {'Content-Type': 'text/plain'});
            res.end(String(err));
        }
    }

    public _toHost = async (res: any, document: any) => {
        const uploader = document['file'];
        return new Promise(resolve => {
            const oldFile = uploader[0].filepath;
            const ext = AppUtil.getFileExtension(uploader[0].originalFilename);

            const newFile = Configs.documentsPath + file;

            this._id = uploader[0].newFilename;
            fs.rename(oldFile, newFile, function (err) {
                if (err) {
                    resolve(err)
                    res.json(err);
                } else {}
            });
        })
    }

}
