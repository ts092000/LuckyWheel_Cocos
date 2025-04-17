import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
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

    @property(Node)
    private luckyWheelNode: Node;

    public get LuckyWheelNode() : Node {
        return this.luckyWheelNode;
    }
    
    public set LuckyWheelNode(luckyWheelNode : Node) {
        this.luckyWheelNode = luckyWheelNode;
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

    @property(Label)
    private labelUserName: Label;

    public get LabelUserName() : Label {
        return this.labelUserName;
    }
    
    public set LabelUserName(labelUserName : Label) {
        this.labelUserName = labelUserName;
    }

    @property(Label)
    private labelUserPhoneNumber: Label;

    public get LabelUserPhoneNumber() : Label {
        return this.labelUserPhoneNumber;
    }
    
    public set LabelUserPhoneNumber(labelUserPhoneNumber : Label) {
        this.labelUserPhoneNumber = labelUserPhoneNumber;
    }

    @property(Label)
    private labelUserCode: Label;

    public get LabelUserCode() : Label {
        return this.labelUserCode;
    }
    
    public set LabelUserCode(labelUserCode : Label) {
        this.labelUserCode = labelUserCode;
    }

    @property(Node)
    private historyRewardNode: Node;

    public get HistoryRewardNode() : Node {
        return this.historyRewardNode;
    }
    
    public set HistoryRewardNode(historyRewardNode : Node) {
        this.historyRewardNode = historyRewardNode;
    }
}


