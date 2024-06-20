import {Configs} from "../configs";

export class DebugService {

    public static printExtractedText = (text: string) => {
        if (!Configs.isDebug) return;
        console.log('============ extracted text from document ============');
        console.log(text);
        console.log('\n');
    }

    public static printDocumentType = (text: string) => {
        if (!Configs.isDebug) return;
        console.log('============ document type ============');
        console.log(text);
        console.log('\n');
    }

    public static printAIResponse = (text: string) => {
        if (!Configs.isDebug) return;
        console.log('============ AI response ============');
        console.log(text);
        console.log('\n');
    }

}