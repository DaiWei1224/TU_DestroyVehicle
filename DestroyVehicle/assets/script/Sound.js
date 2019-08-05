window.Sound={};
var Sound={
    //SoundClips:[cc.AudioClip],
    SoundVolume:Number,
};
Sound.PlaySound=function(SoundName){
    Sound.SetVolume(1);
    cc.loader.loadRes("Sound/"+SoundName, cc.AudioClip, function (err, audioClip) {
        cc.log(typeof audioClip);  // 'object'
        cc.audioEngine.play(audioClip, false, Sound.SoundVolume);
    });
};

Sound.SetVolume=function(Vnum)
{
    if(Vnum<=1)
        Sound.SoundVolume=Vnum;
};