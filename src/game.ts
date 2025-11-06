import "frida-il2cpp-bridge";

export let Csharp: Il2Cpp.Image;
export let UnityWebRequestModule: Il2Cpp.Image;
// Text
export let TextMeshPro: Il2Cpp.Image;
export let TextRenderingModule: Il2Cpp.Image;
// Sirius related
export let Sirius: Il2Cpp.Image;
export let Sirius_entity: Il2Cpp.Image;

Il2Cpp.perform(() => {
    Csharp = Il2Cpp.domain.assembly("Assembly-CSharp").image;
    UnityWebRequestModule = Il2Cpp.domain.assembly('UnityEngine.UnityWebRequestModule').image;
    // Text
    TextMeshPro = Il2Cpp.domain.assembly("Unity.TextMeshPro").image;
    TextRenderingModule = Il2Cpp.domain.assembly('UnityEngine.TextRenderingModule').image;
    // Sirius
    Sirius = Il2Cpp.domain.assembly("Sirius").image;
    Sirius_entity = Il2Cpp.domain.assembly("Sirius.Entity").image;

    //class
    
})