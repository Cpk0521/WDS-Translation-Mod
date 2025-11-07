import "frida-il2cpp-bridge";
import "./hook.js"
// import * as gameClass from './game.js';
import * as Config from './config.js'
import * as Translation from "./translation.js";
// import { isFileExists } from "./utils.js";

Il2Cpp.perform(() => {
    console.log(Il2Cpp.unityVersion); //2022.3.62f2
})

async function main(){
    await Config.init();
    Translation.init();
}

void main();