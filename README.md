<div align="center">

# WDS-Translation-Mod

中文 | [English](readme_ENG.md)

使用frida實現對World Dai Star**安卓版本遊戲**的翻譯功能。

</div>

## 聲明
> [!WARNING]  
> 本倉庫內的代碼與資源僅供學習與參考。若使用者因使用本Mod而引發的任何直接或間接的後果、損失或法律責任，均與作者無關，由使用者自行承擔全部風險。

## 依賴
- Java
- Node
- Python
- adb
- frida-gadget (16版本)
- apktool (2.9.0)

## 編譯

```shell
# Install dependencies
npm install
# Build dist/_.js
npm run build

# 解壓frida-gadget並放入frida資料夾中
# 把apktool放入tools資料夾中
# Build apks
py buildapk.py
```

## 安裝方式
```shell

# apks 在 apk/signed/ 資料夾下
adb install-multiple base_signed.apk config_signed.apk unity_signed.apk
```

## 配置

你可以使用以下方式進行該Mod的配置修改。
- 在首次運行後產生的`Android/data/包名/files/il2cpp/Moded/config.json`中
- 在[src/config.ts](https://github.com/Cpk0521/WDS-Translation-Mod/blob/main/src/config.ts#L11-L15)檔案中修改並重新編譯

配置說明:
| 名稱 | 說明 |
|---------------------|---------------------|
| isEnableEpisodeTranslation | 是否啟用**劇情**翻譯。 |
| isEnableTheaterTranslation | ~~是否啟用**演劇**翻譯。~~(未實現) |
| fontAssetName | ~~填寫TMP字體包名稱，自定義字體包需用與遊戲版本相同的unity生成並放在`Android/data/包名/files/il2cpp/Moded/`下。~~(未實現)|
| EpisodeTranslationPath | 翻譯csv文件的網址。**`{EPID}`為劇情id，必須填寫並大寫。** |








