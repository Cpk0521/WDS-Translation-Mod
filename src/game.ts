import "frida-il2cpp-bridge";
import "frida-java-bridge"

export let Csharp: Il2Cpp.Image;
export let UnityWebRequestModule: Il2Cpp.Image;
export let AssetBundleModule: Il2Cpp.Image;
// export let mscorlib: Il2Cpp.Image;
// Text
export let TextMeshPro: Il2Cpp.Image;
export let TextRenderingModule: Il2Cpp.Image;
// Sirius related
export let Sirius: Il2Cpp.Image;
export let Sirius_entity: Il2Cpp.Image;

//classes
export let AssetBundle: Il2Cpp.Class;
export let TMP_FontAsset: Il2Cpp.Class;
export let SysByte: Il2Cpp.Class;
export let SysFile: Il2Cpp.Class;
export let SysBinaryReader: Il2Cpp.Class;


Il2Cpp.perform(() => {
    Csharp = Il2Cpp.domain.assembly("Assembly-CSharp").image;
    UnityWebRequestModule = Il2Cpp.domain.assembly('UnityEngine.UnityWebRequestModule').image;
    AssetBundleModule = Il2Cpp.domain.assembly("UnityEngine.AssetBundleModule").image;
    // mscorlib = Il2Cpp.domain.assembly("mscorlib").image;

    
    // Text
    TextMeshPro = Il2Cpp.domain.assembly("Unity.TextMeshPro").image;
    TextRenderingModule = Il2Cpp.domain.assembly('UnityEngine.TextRenderingModule').image;
    // Sirius
    Sirius = Il2Cpp.domain.assembly("Sirius").image;
    Sirius_entity = Il2Cpp.domain.assembly("Sirius.Entity").image;

    //classes
    AssetBundle = AssetBundleModule.class("UnityEngine.AssetBundle");

    SysFile = Il2Cpp.corlib.class("System.IO.File");
    SysByte = Il2Cpp.corlib.class("System.Byte");
    SysBinaryReader = Il2Cpp.corlib.class("System.IO.BinaryReader");
    TMP_FontAsset = TextMeshPro.class("TMPro.TMP_FontAsset");

    
})