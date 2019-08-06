window.Sound={};
Sound={
    //SoundClips:[cc.AudioClip],
    SoundVolume: 1,
    
};
Sound.PlaySound=function(SoundName){
    if(Sound.SoundVolume == 1){
        cc.loader.loadRes("Sound/"+SoundName, cc.AudioClip, function (err, audioClip) {
            cc.log(typeof audioClip);  // 'object'
            //cc.audioEngine.play(audioClip, false, Sound.SoundVolume);
            cc.audioEngine.play(audioClip, false, 1);
        });
    }
};

// Sound.SetVolume=function(Vnum)
// {
//     if(Vnum<=1)
//         Sound.SoundVolume=Vnum;
// };