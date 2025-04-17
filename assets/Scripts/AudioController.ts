import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property(AudioSource)
    public soundGame: AudioSource;

    @property([AudioClip])
    public soundGameList: AudioClip[] = [];

    public playSoundGame(sound: AudioClip): void {
        this.soundGame.clip = sound;
        this.soundGame.play()
    }
}


