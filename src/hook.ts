import "frida-il2cpp-bridge";
import * as gameClass from './game.js';
import * as Translation from './translation.js';

Il2Cpp.perform(()=>{
    const tran : Il2Cpp.Class = gameClass.Sirius.class("Sirius.TransitionFades.AdventureTransitionFade");
    
    tran.method<void>('Awake').implementation = function(){
        console.log('AdventureTransitionFade Awake hooked');
        this.method('Awake').invoke();
        // create new Text object
        
    }
    
    // tran.method('SetMainStoryTitle', 3).implementation = function(chapterText : Il2Cpp.String, episodeText : Il2Cpp.String, titleText : Il2Cpp.String){
    //     return this.method('SetMainStoryTitle').invoke(
    //         chapterText,
    //         episodeText,
    //         titleText
    //     );
    // }
    
    // tran.method('SetEventStoryTitle', 3).implementation = function(eventNameText : Il2Cpp.String, episodeText : Il2Cpp.String, titleText : Il2Cpp.String){
    //     return this.method('SetEventStoryTitle').invoke(
    //         eventNameText,
    //         episodeText,
    //         titleText
    //     );
    // }
    
    // tran.method('SetSideStoryTitle', 2).implementation = function(partText : Il2Cpp.String, titleText : Il2Cpp.String){
    //     return this.method('SetSideStoryTitle').invoke(
    //         partText,
    //         titleText
    //     );
    // }

});

Il2Cpp.perform(() => {
    const storyPreprocess : Il2Cpp.Class = gameClass.Sirius.class("Sirius.StoryPreprocess.EpisodeDetailApiRepository");

    storyPreprocess.method('GetEpisodeDetailAsync', 2).implementation = function(episodeId : number, cancellationToken : Il2Cpp.Object){
        console.log('GetEpisodeDetailAsync hooked, episodeId: ' + episodeId);

        if(Translation.isEnableTranslation){
            Translation.loadAdvTranData(episodeId);
        }
        
        return this.method('GetEpisodeDetailAsync').invoke(
            episodeId,
            cancellationToken
        );
    }
})

Il2Cpp.perform(() => {
    const storypre : Il2Cpp.Class = gameClass.Sirius_entity.class("Sirius.StoryPreprocess.StoryPreprocessResultEntity");
    
    storypre.method('CreateSucceeded', 5).implementation = function(canPlayVoice : boolean, isContinuousPlay : boolean, isAutoPlay : boolean, episodeResult : Il2Cpp.Object, episodeDetailResults : Il2Cpp.Array<Il2Cpp.Object>){

        if(Translation.isEnableTranslation && Translation.hasEpsiodeTranslation){
            let eptitle = Translation.TranslationCache.find(item => item['Id'].toLowerCase() === 'title');
            if(eptitle){
                episodeResult.method('set_EpisodeTitle').invoke(Il2Cpp.string(eptitle["SpeakerName"]));
            }

            const reslength = episodeDetailResults.length ?? 0;
            for (let i = 0; i < (reslength ?? 0); i++) {
                let transItem = Translation.TranslationCache.at(i);
                let detailResult = episodeDetailResults.get(i);
                if(transItem){
                    detailResult.method('set_SpeakerName').invoke(Il2Cpp.string(transItem['SpeakerName']));; 
                    detailResult.method('set_Phrase').invoke(Il2Cpp.string(transItem['translation']));;
                }
            }
        }

        return this.method('CreateSucceeded').invoke(
            canPlayVoice,
            isContinuousPlay,
            isAutoPlay,
            episodeResult,
            episodeDetailResults
        );
    }
});

Il2Cpp.perform(() => {
    const historyDialogBody : Il2Cpp.Class = gameClass.Sirius.class("Sirius.Adventure.AdventureHistoryDialogBody");
    historyDialogBody.method('OnCellViewInstantiated', 2).implementation = function(scroller : Il2Cpp.Object, cellView : Il2Cpp.Object){
        // if(Translation.isEnableTranslation && Translation.hasEpsiodeTranslation){
        //     let phrase = cellView.field<Il2Cpp.Object>('_phrase').value;
        //     Translation.applyFont(phrase)
        // }
        this.method('OnCellViewInstantiated').invoke(
            scroller,
            cellView
        );
    }
});

Il2Cpp.perform(() => {
    const presenter = gameClass.Sirius.class('Sirius.Adventure.AdventurePresenter');
    presenter.method('.ctor').implementation = function(backgroundChanger, adventureMainView, adventureModel, cameraController, uiView : Il2Cpp.Object, effectView, movieView, fadeView, characterCardView, soundVolumeConfig, voicePlayer, timeAdjuster, backKeyHandler, resolutionHelper, fpsChanger){
        console.log('presenter .ctor Hooked')
        // if(Translation.isEnableTranslation && Translation.hasEpsiodeTranslation){
        //     let textpanel = uiView.field<Il2Cpp.Object>('_adventureTextPanel').value;
        //     let phrase = textpanel.field<Il2Cpp.Object>('_phrase').value;
        //     // Translation.applyFont(phrase)
        //     // let speakerName = textpanel.field<Il2Cpp.Object>('_speakerName').value;
        //     // Translation.applyFont(speakerName)
        // }
        this.method('.ctor').invoke(backgroundChanger, adventureMainView, adventureModel, cameraController, uiView, effectView, movieView, fadeView, characterCardView, soundVolumeConfig, voicePlayer, timeAdjuster, backKeyHandler, resolutionHelper, fpsChanger);
    }
});
