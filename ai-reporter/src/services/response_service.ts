export class ResponseService {

    public format = (response: any): any => {
        return {data: JSON.parse(response.data.content), filename: response.filename, success: true};
    }
}
