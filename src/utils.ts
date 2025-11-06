import * as fs from "fs";

export function isFileExists(path : string) {
    try {
        return fs.statSync(path).isFile()
    }
    catch {
        return false
    }
}

export function createText(){
    
}