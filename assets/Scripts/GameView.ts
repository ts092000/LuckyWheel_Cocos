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

    @property(Sprite)
    private spinCircleSprite: Sprite;

    public get SpinCircleSprite() : Sprite {
        return this.spinCircleSprite;
    }

    public set SpinCircleSprite(spinCircleSprite : Sprite) {
        this.spinCircleSprite = spinCircleSprite;
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
}


