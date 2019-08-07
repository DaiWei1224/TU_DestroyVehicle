window.Sound={};
Sound={
    SoundVolume: 1,
    
};
Sound.PlaySound=function(SoundName){
    if(Sound.SoundVolume == 1){
        cc.loader.loadRes("Sound/"+SoundName, cc.AudioClip, function (err, audioClip) {
            cc.audioEngine.play(audioClip, false, 1);
        });
    }
};
