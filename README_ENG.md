<div align="center">

# WDS-Translation-Mod

[中文](README.md) | English

Implement translation functionality for the World Dai Star **Android version** using Frida.

</div>

## Disclaimer
> [!WARNING]  
> The code and resources in this repository are for learning and reference purposes only. The author is not responsible for any direct or indirect consequences, losses, or legal liabilities arising from the use of this Mod. Users bear all risks independently.

## Dependencies
- Java
- Node
- Python
- adb
- frida-gadget (version 16)
- apktool (2.9.0)

## Build

```shell
# Install dependencies
npm install
# Build dist/_.js
npm run build

# Extract frida-gadget and place it in the frida folder
# Place apktool in the tools folder
# Build apks
py buildapk.py
```

## Installation
```shell
# apks are located in the ./apk/signed/ folder
adb install-multiple base_signed.apk config_signed.apk unity_signed.apk
```

## Configuration

You can modify the Mod configuration using the following methods:
- In `Android/data/package_name/files/il2cpp/Moded/config.json` generated after the first run
- Modify in the [src/config.ts](https://github.com/Cpk0521/WDS-Translation-Mod/blob/main/src/config.ts#L11-L15) file and recompile

Configuration Description:
| Name | Description |
|---------------------|---------------------|
| isEnableEpisodeTranslation | Enable **Episode** translation. |
| isEnableTheaterTranslation | ~~Enable **Theater** translation.~~ (Not implemented) |
| fontAssetName | ~~Set the TMP font package name. Custom font packages need to be generated with the same Unity version as the game and placed in `Android/data/package_name/files/il2cpp/Moded/`.~~ (Not implemented)|
| EpisodeTranslationPath | URL of the translation CSV file. **`{EPID}` is the episode ID and must be filled in and uppercase.** |


