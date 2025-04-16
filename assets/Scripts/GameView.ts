import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property(Node)
    private popupShowRewardNode: Node;

    public get PopupShowRewardNode() : Node {
        return this.popupShowRewardNode;
    }
    
    public set PopupShowRewardNode(popupShowRewardNode : Node) {
        this.popupShowRewardNode = popupShowRewardNode;
    }

    @property(Node)
    private popupEnterInfoUserNode: Node;

    public get PopupEnterInfoUserNode() : Node {
        return this.popupEnterInfoUserNode;
    }
    
    public set PopupEnterInfoUserNode(popupEnterInfoUserNode : Node) {
        this.popupEnterInfoUserNode = popupEnterInfoUserNode;
    }

    @property(Sprite)
    private spinCircleSprite: Sprite;

    public get SpinCircleSprite() : Sprite {
        return this.spinCircleSprite;
    }

    public set SpinCircleSprite(spinCircleSprite : Sprite) {
        this.spinCircleSprite = spinCircleSprite;
    }

    @property(Sprite)
    private bgSprite: Sprite;

    public get BgSprite() : Sprite {
        return this.bgSprite;
    }

    public set BgSprite(bgSprite : Sprite) {
        this.bgSprite = bgSprite;
    }

    @property([SpriteFrame])
    private spinCircleSpriteFrame: SpriteFrame[] = [];

    public get SpinCircleSpriteFrame() : SpriteFrame[] {
        return this.spinCircleSpriteFrame;
    }

    public set SpinCircleSpriteFrame(spinCircleSpriteFrame : SpriteFrame[]) {
        this.spinCircleSpriteFrame = spinCircleSpriteFrame;
    }

    @property(Node)
    private rewardTable: Node;

    public get RewardTable() : Node {
        return this.rewardTable;
    }
    
    public set RewardTable(rewardTable : Node) {
        this.rewardTable = rewardTable;
    }

    @property(Node)
    private frameDarkFull: Node;

    public get FrameDarkFull() : Node {
        return this.frameDarkFull;
    }
    
    public set FrameDarkFull(frameDarkFull : Node) {
        this.frameDarkFull = frameDarkFull;
    }
}


