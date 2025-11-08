import "frida-il2cpp-bridge";
import * as gameClass from './game.js';
import * as Config from './config.js'
import { SysOpenFile2Byte } from './utils.js'

export let isEnableEpisodeTranslation : boolean = true;

export let hasEpsiodeTranslation : boolean = false;
export let EpsiodeTranslationCache: { [key: string]: string }[] = [];

export let FontCache : Il2Cpp.Object = null;
export let hasFontAsset : boolean = false;

export async function init(){
    isEnableEpisodeTranslation = Config.currentConfig.isEnableEpisodeTranslation;

    //not working too..
    // Il2Cpp.perform(() => {
    //     let fontPath = `${Il2Cpp.application.dataPath}/il2cpp/Moded/${Config.currentConfig.fontAssetName}`;
    //     SysOpenFile2Byte(fontPath, (bytes : Il2Cpp.Array<UInt64>)=>{
    //         let abfilebytes = bytes;
    //         let ab = gameClass.AssetBundle.method<Il2Cpp.Object>("LoadFromMemory").invoke(abfilebytes);
    //         if (ab.isNull()) {
    //             console.error("[LoadFromMemory] font load failed.");
    //             FontCache = null;
    //         }
    //         FontCache = ab.method<Il2Cpp.Object>("LoadAsset", 1).inflate(gameClass.TMP_FontAsset).invoke(Il2Cpp.string(`${Config.currentConfig.fontAssetName} SDF`));
    //         console.log(FontCache);
    //         ab.method("Unload", 1).invoke(false);
    //     })
    // })
}

// LoadFromFileAsync is not working...
// export async function loadFont(fontPath : string){
//     if(gameClass.SysFile.method<boolean>("Exists", 1).invoke(Il2Cpp.string(fontPath))){
//         console.log('Font Asset Exist *')
//         let ab_req = gameClass.AssetBundle.method<Il2Cpp.Object>("LoadFromFileAsync", 1).invoke(Il2Cpp.string(fontPath));
//         while(!ab_req.method('get_isDone').invoke()){
//             await new Promise(resolve => setTimeout(resolve, 100));
//         }
//         console.log('Done! ', ab_req.method('get_isDone').invoke())
//         let ab = ab_req.method<Il2Cpp.Object>('get_assetBundle').invoke()
//         if (ab.isNull()){
//             console.error("Failed to load AssetBundle at path : ", fontPath)
//         }
    
//     }
//     else{
//         console.log("Can not find the File")
//     }
// }

export function replaceFont(Tmp_Text: Il2Cpp.Object) {
    Il2Cpp.perform(()=>{
        if(FontCache){
            // const fontAsset = Tmp_Text.method<Il2Cpp.Object>('get_font').invoke();
            // console.log(fontAsset)
            // if(fontAsset) {
                // fontAsset.method('set_sourceFontFile').invoke(FontCache);
            //     fontAsset.method('UpdateFontAssetData').invoke()
            // }
            Tmp_Text.method('set_font').invoke(FontCache);
        }
        else{
            console.log(Tmp_Text, ' No Font to replace')
        }
    })
}

export async function loadAdvTranData(advId : number): Promise<any> {
    let uri = `${Config.currentConfig.EpisodeTranslationPath.replace("{EPID}", advId.toString())}`
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
    EpsiodeTranslationCache = [];

    //
    if(!cache.includes("Not Found")){
        EpsiodeTranslationCache = parseCsvToJson(cache);
        hasEpsiodeTranslation = (EpsiodeTranslationCache.length > 0);
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
