import "frida-il2cpp-bridge";
import "./hook.js"
import * as gameClass from './game.js';
import * as Config from './config.js'
import * as Translation from "./translation.js";
import { isFileExists } from "./utils.js";
import { scheduler } from "node:timers/promises";

async function main(){
    await Config.init();
    Translation.init();
}

void main();