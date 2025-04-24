import { _decorator, Component, Label, Node, ProgressBar, RichText, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemWheel')
export class ItemWheel extends Component {
    @property(Sprite)
    public spriteItemWheel: Sprite;

    @property(Sprite)
    public spriteItemReward: Sprite;

    @property(Node)
    public nodeBg: Node;

    @property(Sprite)
    public spriteBg: Sprite;

    @property(Label)
    public labelItemWheel: Label;

    @property(ProgressBar)
    public progressBarItemWheel: ProgressBar;

    @property(RichText)
    public richTextItemWheel: RichText;
}


