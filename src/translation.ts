import "frida-il2cpp-bridge";
import * as gameClass from './game.js';
import * as Config from './config.js'
import { isFileExists } from './utils.js'

export let isEnableTranslation : boolean = true;

export let hasEpsiodeTranslation : boolean = false;
export let TranslationCache: { [key: string]: string }[] = [];

export let FontCache : Il2Cpp.Object = null;
export let hasFontAsset : boolean = false;

export async function init(){
    isEnableTranslation = Config.currentConfig.isEnableTranslation;

    // Il2Cpp.perform(()=>{
    //     let fontPath = `${Il2Cpp.application.dataPath}/il2cpp/Moded/${Config.currentConfig.fontFile}`;
    //     if(isFileExists(fontPath)){
    //         //GetPathsToOSFonts
    //         const font_klass = gameClass.TextRenderingModule.class('UnityEngine.Font');
    //         const createFontFromPath = font_klass.method('Internal_CreateFontFromPath', 2).invoke;

    //         const new_font = font_klass.new();
    //         new_font.method('.ctor', 1).invoke(Il2Cpp.string(fontPath));

    //         createFontFromPath(new_font, Il2Cpp.string(fontPath));
    //         console.log(new_font);
    //         // const new_font = gameClass.TextRenderingModule.class('UnityEngine.Font').new();
    //         // new_font.method('.ctor', 1).invoke(Il2Cpp.string(fontPath));
    //         // if(new_font){
    //         //     FontCache = new_font;
    //         //     hasFontAsset = true;
    //         //     console.log('Created New Font !', new_font)
    //         // }
    //     }
    // })
}

// export function applyFont(Tmp_Text: Il2Cpp.Object) {
//     if(!hasFontAsset) return;
//     // if(FontHooked) return;
//     //
    
//     // Il2Cpp.perform(()=>{
//     //     const fontAsset = Tmp_Text.method<Il2Cpp.Object>('get_font').invoke();
//     //     console.log(fontAsset)
//     //     if(fontAsset) {
//     //         fontAsset.method('set_sourceFontFile').invoke(FontCache);
//     //         fontAsset.method('UpdateFontAssetData').invoke()
//     //     }
//     //     Tmp_Text.method('set_font').invoke(FontCache);

//     // })
// }

export async function loadAdvTranData(advId : number): Promise<any> {
    let uri = `${Config.currentConfig.TranslationPath.replace("{EPID}", advId.toString())}`
    const url = Il2Cpp.string(uri);

    const instance = gameClass.UnityWebRequestModule.class("UnityEngine.Networking.UnityWebRequest")
    const webrequest = instance.method<Il2Cpp.Object>("Get").invoke(url);

    webrequest.method("SendWebRequest").invoke();

    while (!webrequest.method("get_isDone").invoke()) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const result = webrequest.method<Il2Cpp.Object>("get_downloadHandler").invoke();
    const cache = result.method<Il2Cpp.String>("get_text").invoke().content;

    //reset cache
    hasEpsiodeTranslation = false;
    TranslationCache = [];

    //
    if(!cache.includes("Not Found")){
        TranslationCache = parseCsvToJson(cache);
        hasEpsiodeTranslation = (TranslationCache.length > 0);
        console.log(`Loaded translation for Epsiode ${advId}`);
    }
}

function parseCsvToJson(csvText: string) {
    const result: { [key: string]: string }[] = [];

    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if(currentLine.length !== headers.length) {
            continue;
        }
        const obj: { [key: string]: string } = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
    }
    return result;
}
