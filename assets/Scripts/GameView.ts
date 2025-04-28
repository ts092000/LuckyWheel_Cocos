import { _decorator, Animation, Component, Label, LabelOutline, Node, Sprite, SpriteFrame } from 'cc';
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
    private popupEnterInfoUserTableNode: Node;

    public get PopupEnterInfoUserTableNode() : Node {
        return this.popupEnterInfoUserTableNode;
    }
    
    public set PopupEnterInfoUserTableNode(popupEnterInfoUserTableNode : Node) {
        this.popupEnterInfoUserTableNode = popupEnterInfoUserTableNode;
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

    @property(Node)
    private informationRemainingCountOutside: Node;

    public get InformationRemainingCountOutside() : Node {
        return this.informationRemainingCountOutside;
    }
    
    public set InformationRemainingCountOutside(informationRemainingCountOutside : Node) {
        this.informationRemainingCountOutside = informationRemainingCountOutside;
    }

    @property(Label)
    private informationRemainingCountLabelOutside: Label;

    public get InformationRemainingCountLabelOutside() : Label {
        return this.informationRemainingCountLabelOutside;
    }
    
    public set InformationRemainingCountLabelOutside(informationRemainingCountLabelOutside : Label) {
        this.informationRemainingCountLabelOutside = informationRemainingCountLabelOutside;
    }

    @property(Node)
    private informationUserOutside: Node;

    public get InformationUserOutside() : Node {
        return this.informationUserOutside;
    }
    
    public set InformationUserOutside(informationUserOutside : Node) {
        this.informationUserOutside = informationUserOutside;
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

    @property(Label)
    private labelCongrats: Label;

    public get LabelCongrats() : Label {
        return this.labelCongrats;
    }
    
    public set LabelCongrats(labelCongrats : Label) {
        this.labelCongrats = labelCongrats;
    }

    @property(LabelOutline)
    private labelOutLabelOutlineCongrats: LabelOutline;

    public get LabelOutlineCongrats() : LabelOutline {
        return this.labelOutLabelOutlineCongrats;
    }
    
    public set LabelOutlineCongrats(labelOutLabelOutlineCongrats : LabelOutline) {
        this.labelOutLabelOutlineCongrats = labelOutLabelOutlineCongrats;
    }

    @property(Sprite)
    private rewardInPopupSprite: Sprite;

    public get RewardInPopupSprite() : Sprite {
        return this.rewardInPopupSprite;
    }

    public set RewardInPopupSprite(rewardInPopupSprite : Sprite) {
        this.rewardInPopupSprite = rewardInPopupSprite;
    }

    @property(Label)
    private rewardInPopupSpriteLabel: Label;

    public get RewardInPopupSpriteLabel() : Label {
        return this.rewardInPopupSpriteLabel;
    }
    
    public set RewardInPopupSpriteLabel(rewardInPopupSpriteLabel : Label) {
        this.rewardInPopupSpriteLabel = rewardInPopupSpriteLabel;
    }

    @property(LabelOutline)
    private rewardInPopupSpriteLabelOutline: LabelOutline;

    public get RewardInPopupSpriteLabelOutline() : LabelOutline {
        return this.rewardInPopupSpriteLabelOutline;
    }
    
    public set RewardInPopupSpriteLabelOutline(rewardInPopupSpriteLabelOutline : LabelOutline) {
        this.rewardInPopupSpriteLabelOutline = rewardInPopupSpriteLabelOutline;
    }

    @property(Node)
    private informationUserCodeOutside: Node;

    public get InformationUserCodeOutside() : Node {
        return this.informationUserCodeOutside;
    }
    
    public set InformationUserCodeOutside(informationUserCodeOutside : Node) {
        this.informationUserCodeOutside = informationUserCodeOutside;
    }

    @property(Node)
    private loadingNode: Node;

    public get LoadingNode() : Node {
        return this.loadingNode;
    }
    
    public set LoadingNode(loadingNode : Node) {
        this.loadingNode = loadingNode;
    }

    @property(Animation)
    private loadingAnim: Animation;

    public get LoadingAnim() : Animation {
        return this.loadingAnim;
    }
    
    public set LoadingAnim(loadingAnim : Animation) {
        this.loadingAnim = loadingAnim;
    }

    @property(Label)
    private wheelNameLabel: Label;

    public get WheelNameLabel() : Label {
        return this.wheelNameLabel;
    }
    
    public set WheelNameLabel(wheelNameLabel : Label) {
        this.wheelNameLabel = wheelNameLabel;
    }

    @property(Label)
    private startTimeWheelLabel: Label;

    public get StartTimeWheelLabel() : Label {
        return this.startTimeWheelLabel;
    }
    
    public set StartTimeWheelLabel(startTimeWheelLabel : Label) {
        this.startTimeWheelLabel = startTimeWheelLabel;
    }

    @property(Label)
    private endTimeWheelLabel: Label;

    public get EndTimeWheelLabel() : Label {
        return this.endTimeWheelLabel;
    }
    
    public set EndTimeWheelLabel(endTimeWheelLabel : Label) {
        this.endTimeWheelLabel = endTimeWheelLabel;
    }

    @property(Node)
    private isActiveNode: Node;

    public get IsActiveNode() : Node {
        return this.isActiveNode;
    }
    
    public set IsActiveNode(isActiveNode : Node) {
        this.isActiveNode = isActiveNode;
    }
    
    @property(Label)
    private labelInActiveNode: Label;

    public get LabelInActiveNode() : Label {
        return this.labelInActiveNode;
    }
    
    public set LabelInActiveNode(labelInActiveNode : Label) {
        this.labelInActiveNode = labelInActiveNode;
    }
}


