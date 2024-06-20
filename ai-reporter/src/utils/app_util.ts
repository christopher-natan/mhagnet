import path from "path";

/**
 * ALl app utility functions should reside here
 */
export class AppUtil {
    static getJsonPrompt(response: any): string {
       const json = JSON.parse(response.data.content);
       return json.type.toLowerCase().split(' ').join('-') + '.json';
    }

    static isValidJson = (jsonString: any): any => {
        try {
            const parsed = JSON.parse(jsonString);
            return typeof parsed === 'object' && parsed !== null;
        } catch (e) {
            return false;
        }
    }

    static getFileExtension(file: string) {
        return path.extname(file).substring(1);
    }
}
