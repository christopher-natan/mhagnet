import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import {PromptsService} from "./prompts_service";
import {Subject} from "rxjs";
import {ErrorService} from "./error_service";
import {ChatCompletionStream} from "openai/lib/ChatCompletionStream";
import {Chat} from "openai/resources";
import ChatCompletionMessage = Chat.ChatCompletionMessage;
import normalizeText, {
    normalizeDiacritics,
    normalizeName,
    normalizeParagraph,
    normalizeWhiteSpaces
} from "normalize-text";
import {DebugService} from "./debug_service";
dotenv.config();

export class OpenAiService {
    _promptService: PromptsService = new PromptsService();
    _res: any;
    _headers: any = [];
    _filename: string = '';
    onResponse: Subject<any> = new Subject();
    model: string = '';

    public setRes = (res: any) => this._res = res;
    _openai: OpenAI = new OpenAI({

    });

    public chat = (headers: any, documentData: any, prompt: string = '', filename: string) => {
        const parent: OpenAiService = this;
        this._headers = headers;
        this._filename = filename;

        return this._promptService.get(prompt).subscribe({
            async next(promptData): Promise<void> {
                const infoData: string = parent._getInformation(promptData);
                documentData = parent._sanitizeText(documentData.text);
                await parent._ask(infoData, documentData);
            },
            error(error) {
                parent._res.json(ErrorService.aiError(error));
            },
        });
    }

    protected _sanitizeText = (text: string): string => {
        text = normalizeWhiteSpaces(text);
        text = normalizeText(text);
        text = normalizeParagraph(text);
        text = normalizeName(text);
        text = normalizeDiacritics(text);
        return text;
    }

    protected _getInformation = (promptData: { documentType: any[]; prompt: string; model: string, information: any[] }) => {
        let headers: string = '';
        let content: string = '';
        headers = this._headers.join(', ');
        content = promptData.prompt.replace('{INFORMATION}', headers);
        return content + `:"${headers}"`;
    }

    protected _ask = async (infoData: string, documentData: {
        documentType: any[];

        information: any[]
    }): Promise<void> => {
        try {
            const stream: ChatCompletionStream = this._openai.beta.chat.completions.stream({
                model: 'gpt-4',
                messages: [{role: 'user', content: infoData + documentData}],
                stream: true,
            });

            const chatCompletion: OpenAI.Chat.Completions.ChatCompletion = await stream.finalChatCompletion();
            let completion: ChatCompletionMessage;
            try {
                completion = chatCompletion.choices[0].message;
                const data: { data: ChatCompletionMessage; status: string, filename: string } = {data: completion, status: 'complete', filename: this._filename};
            } catch (e) {}
        } catch (error: any) {
            this._res.json(ErrorService.aiError(error));
        }
    }

}


