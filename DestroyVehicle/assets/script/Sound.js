window.Sound={};
var Sound={
    //SoundClips:[cc.AudioClip],
};
Sound.PlaySound=function(SoundName){
    cc.loader.loadRes("Sound/"+SoundName, cc.AudioClip, function (err, audioClip) {
        cc.log(typeof audioClip);  // 'object'
        cc.audioEngine.play(audioClip, false, 1);
    });
};