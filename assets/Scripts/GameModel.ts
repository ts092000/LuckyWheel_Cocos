import { _decorator, Button, Component, EditBox, Node, Prefab } from 'cc';
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

    @property(Node)
    private itemWheelContainer: Node;

    public get ItemWheelContainer() : Node {
        return this.itemWheelContainer;
    }

    public set ItemWheelContainer(itemWheelContainer : Node) {
        this.itemWheelContainer = itemWheelContainer;
    }

    @property(EditBox)
    private editBoxName: EditBox;

    public get EditBoxName() : EditBox {
        return this.editBoxName;
    }

    public set EditBoxName(editBoxName : EditBox) {
        this.editBoxName = editBoxName;
    }

    @property(EditBox)
    private editBoxPhoneNumber: EditBox;

    public get EditBoxPhoneNumber() : EditBox {
        return this.editBoxPhoneNumber;
    }

    public set EditBoxPhoneNumber(editBoxPhoneNumber : EditBox) {
        this.editBoxPhoneNumber = editBoxPhoneNumber;
    }

    @property(EditBox)
    private editBoxCode: EditBox;

    public get EditBoxCode() : EditBox {
        return this.editBoxCode;
    }

    public set EditBoxCode(editBoxCode : EditBox) {
        this.editBoxCode = editBoxCode;
    }
}


