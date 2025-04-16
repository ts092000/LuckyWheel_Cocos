import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemWheel')
export class ItemWheel extends Component {
    @property(Sprite)
    public spriteItemWheel: Sprite;

    @property(Sprite)
    public spriteItemReward: Sprite;

    @property(Label)
    public labelItemWheel: Label;
}


