import { _decorator, Button, Component, EditBox, Label, LabelOutline, Node, Prefab, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property(Node)
    private spinNode: Node;

    public get SpinNode() : Node {
        return this.spinNode;
    }

    public set SpinNode(spinNode : Node) {
        this.spinNode = spinNode;
    }

    @property(Button)
    private btnSpin: Button;

    public get BtnSpin() : Button {
        return this.btnSpin;
    }

    public set BtnSpin(btnSpin : Button) {
        this.btnSpin = btnSpin;
    }

    @property(Button)
    private btnOpenPopup: Button;

    public get BtnOpenPopup() : Button {
        return this.btnOpenPopup;
    }

    public set BtnOpenPopup(btnOpenPopup : Button) {
        this.btnOpenPopup = btnOpenPopup;
    }

    @property(Button)
    private btnClosePopup: Button;

    public get BtnClosePopup() : Button {
        return this.btnClosePopup;
    }

    public set BtnClosePopup(btnClosePopup : Button) {
        this.btnClosePopup = btnClosePopup;
    }

    @property(Button)
    private btnClosePopup2: Button;

    public get BtnClosePopup2() : Button {
        return this.btnClosePopup2;
    }

    public set BtnClosePopup2(btnClosePopup2 : Button) {
        this.btnClosePopup2 = btnClosePopup2;
    }

    @property(Prefab)
    private itemRewardPrefab: Prefab;

    public get ItemRewardPrefab() : Prefab {
        return this.itemRewardPrefab;
    }

    public set ItemRewardPrefab(itemRewardPrefab : Prefab) {
        this.itemRewardPrefab = itemRewardPrefab;
    }

    @property(Node)
    private itemRewardContainer: Node;

    public get ItemRewardContainer() : Node {
        return this.itemRewardContainer;
    }

    public set ItemRewardContainer(itemRewardContainer : Node) {
        this.itemRewardContainer = itemRewardContainer;
    }

    @property(Prefab)
    private itemWheelPrefab: Prefab;

    public get ItemWheelPrefab() : Prefab {
        return this.itemWheelPrefab;
    }

    public set ItemWheelPrefab(itemWheelPrefab : Prefab) {
        this.itemWheelPrefab = itemWheelPrefab;
    }

    @property(Prefab)
    private itemWheelPrefab2: Prefab;

    public get ItemWheelPrefab2() : Prefab {
        return this.itemWheelPrefab2;
    }

    public set ItemWheelPrefab2(itemWheelPrefab2 : Prefab) {
        this.itemWheelPrefab2 = itemWheelPrefab2;
    }

    @property(Node)
    private itemWheelContainer: Node;

    public get ItemWheelContainer() : Node {
        return this.itemWheelContainer;
    }

    public set ItemWheelContainer(itemWheelContainer : Node) {
        this.itemWheelContainer = itemWheelContainer;
    }

    @property(Node)
    private nameNodeInPopupEnterUser: Node;

    public get NameNodeInPopupEnterUser() : Node {
        return this.nameNodeInPopupEnterUser;
    }

    public set NameNodeInPopupEnterUser(nameNodeInPopupEnterUser : Node) {
        this.nameNodeInPopupEnterUser = nameNodeInPopupEnterUser;
    }

    @property(Node)
    private phoneNumberNodeInPopupEnterUser: Node;

    public get PhoneNumberInPopupEnterUser() : Node {
        return this.phoneNumberNodeInPopupEnterUser;
    }

    public set PhoneNumberInPopupEnterUser(phoneNumberNodeInPopupEnterUser : Node) {
        this.phoneNumberNodeInPopupEnterUser = phoneNumberNodeInPopupEnterUser;
    }

    @property(Node)
    private codeNodeInPopupEnterUser: Node;

    public get CodeNodeInPopupEnterUser() : Node {
        return this.codeNodeInPopupEnterUser;
    }

    public set CodeNodeInPopupEnterUser(codeNodeInPopupEnterUser : Node) {
        this.codeNodeInPopupEnterUser = codeNodeInPopupEnterUser;
    }

    @property(EditBox)
    private editBoxName: EditBox;

    public get EditBoxName() : EditBox {
        return this.editBoxName;
    }

    public set EditBoxName(editBoxName : EditBox) {
        this.editBoxName = editBoxName;
    }

    @property(Label)
    private labelNameInEditBox: Label;

    public get LabelNameInEditBox() : Label {
        return this.labelNameInEditBox;
    }

    public set LabelNameInEditBox(labelNameInEditBox : Label) {
        this.labelNameInEditBox = labelNameInEditBox;
    }

    @property(Label)
    private labelNamePlaceHolder: Label;

    public get LabelNamePlaceHolder() : Label {
        return this.labelNamePlaceHolder;
    }

    public set LabelNamePlaceHolder(labelNamePlaceHolder : Label) {
        this.labelNamePlaceHolder = labelNamePlaceHolder;
    }

    @property(LabelOutline)
    private labelOutlineNamePlaceHolder: LabelOutline;

    public get LabelOutlineNamePlaceHolder() : LabelOutline {
        return this.labelOutlineNamePlaceHolder;
    }

    public set LabelOutlineNamePlaceHolder(labelOutlineNamePlaceHolder : LabelOutline) {
        this.labelOutlineNamePlaceHolder = labelOutlineNamePlaceHolder;
    }

    @property(EditBox)
    private editBoxPhoneNumber: EditBox;

    public get EditBoxPhoneNumber() : EditBox {
        return this.editBoxPhoneNumber;
    }

    public set EditBoxPhoneNumber(editBoxPhoneNumber : EditBox) {
        this.editBoxPhoneNumber = editBoxPhoneNumber;
    }

    @property(Label)
    private labelPhoneNumberInEditBox: Label;

    public get LabelPhoneNumberInEditBox() : Label {
        return this.labelPhoneNumberInEditBox;
    }

    public set LabelPhoneNumberInEditBox(labelPhoneNumberInEditBox : Label) {
        this.labelPhoneNumberInEditBox = labelPhoneNumberInEditBox;
    }

    @property(EditBox)
    private editBoxCode: EditBox;

    public get EditBoxCode() : EditBox {
        return this.editBoxCode;
    }

    public set EditBoxCode(editBoxCode : EditBox) {
        this.editBoxCode = editBoxCode;
    }

    @property(Label)
    private labelCodeInEditBox: Label;

    public get LabelCodeInEditBox() : Label {
        return this.labelCodeInEditBox;
    }

    public set LabelCodeInEditBox(labelCodeInEditBox : Label) {
        this.labelCodeInEditBox = labelCodeInEditBox;
    }

    @property(Button)
    private btnConfirmEnterUserInfor: Button;

    public get BtnConfirmEnterUserInfor() : Button {
        return this.btnConfirmEnterUserInfor;
    }

    public set BtnConfirmEnterUserInfor(btnConfirmEnterUserInfor : Button) {
        this.btnConfirmEnterUserInfor = btnConfirmEnterUserInfor;
    }

    @property(Node)
    private itemRewardHistoryContainer: Node;

    public get ItemRewardHistoryContainer() : Node {
        return this.itemRewardHistoryContainer;
    }

    public set ItemRewardHistoryContainer(itemRewardHistoryContainer : Node) {
        this.itemRewardHistoryContainer = itemRewardHistoryContainer;
    }

    @property(Prefab)
    private itemWRewardHistoryPrefab: Prefab;

    public get ItemWRewardHistoryPrefab() : Prefab {
        return this.itemWRewardHistoryPrefab;
    }

    public set ItemWRewardHistoryPrefab(itemWRewardHistoryPrefab : Prefab) {
        this.itemWRewardHistoryPrefab = itemWRewardHistoryPrefab;
    }

    @property(ScrollView)
    private scrollViewHistory: ScrollView;

    public get SrollViewHistory() : ScrollView {
        return this.scrollViewHistory;
    }

    public set ScrollViewHistory(scrollViewHistory : ScrollView) {
        this.scrollViewHistory = scrollViewHistory;
    }

    @property(Button)
    private btnEditInfoUser: Button;

    public get BtnEditInfoUser() : Button {
        return this.btnEditInfoUser;
    }

    public set BtnEditInfoUser(btnEditInfoUser : Button) {
        this.btnEditInfoUser = btnEditInfoUser;
    }
}


