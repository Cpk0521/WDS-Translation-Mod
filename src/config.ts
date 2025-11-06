import * as fs from "fs";
import "frida-il2cpp-bridge";
import { isFileExists } from "./utils.js";

interface IConfig {
    isEnableTranslation: boolean;
    fontFile: string;
    TranslationPath: string;
}

const DEFAULT_CONFIG = {
    isEnableTranslation: true,
    fontFile: "HiraginoSansGB.ttf",
    TranslationPath: "https://raw.githubusercontent.com/DreamGallery/WDS-Translation-Csv/refs/heads/main/TranslationCsv/{EPID}.csv",
}

export let currentConfig: IConfig = {...DEFAULT_CONFIG};

export async function init(){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            // Il2Cpp.perform(()=>{
                const configPath = `${Il2Cpp.application.dataPath}/il2cpp/Moded/config.json`;
                if (isFileExists(configPath)){
                    const content : string = fs.readFileSync(configPath, 'utf-8') as string;
                    try {
                        const loadedConfig = JSON.parse(content);
                        currentConfig = {...currentConfig, ...loadedConfig};
                        console.log(`read config file Successfully read config file`);
                    }
                    catch(e : any){
                        console.error('Failed to parse config file')
                    }
                }
                else{
                    currentConfig = {...DEFAULT_CONFIG};
                    console.warn(`Config file not found.`);
                }
                //方便日後加新value
                try{
                    fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2))
                    console.log(`Successfully created/updated config file`);
                }
                catch(e:any){
                    console.log(`Failed to create config file`);
                }
                resolve(currentConfig);
            // });
        }, 3000)
    })
}