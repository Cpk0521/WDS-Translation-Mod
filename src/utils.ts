import * as fs from "fs";
import * as gameClass from './game.js';

export function isFileExists(path : string) {
    try {
        return fs.statSync(path).isFile()
    }
    catch {
        return false
    }
}

export function SysOpenFile2Byte(path : string, callback : (bytes : any) => void) {
    Il2Cpp.perform(() => {
        if(gameClass.SysFile.method<boolean>("Exists", 1).invoke(Il2Cpp.string(path))){
            console.log('Font Asset Exist')
            let fsfile = gameClass.SysFile.method<Il2Cpp.Object>("OpenRead", 1).invoke(Il2Cpp.string(path));
            let brfile = gameClass.SysBinaryReader.new();
            brfile.method<Il2Cpp.Object>(".ctor", 1).invoke(fsfile);
            var filebytes = brfile.method<Il2Cpp.Array<UInt64>>("ReadBytes", 1).invoke(Number(fsfile.method("get_Length").invoke()));
            callback(filebytes);
        }
        else{
            console.log("Can not Open the File to Byte")
        }
    })
}

export function createText(){
        
}