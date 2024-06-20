export class ErrorService {
    static aiError = (error: any): { details: string, type: string } => {
        return {details: error, type: 'ai'};
    }

    static documentError = (error: any): { details: string, type: string } => {
        return {details: error, type: 'document'};
    }

    static requestError = (error: any): { details: string, type: string } => {
        return {details: error, type: 'request'};
    }

    static responseError = (error: any): { details: string, type: string } => {
        return {details: error, type: 'response'};
    }
}