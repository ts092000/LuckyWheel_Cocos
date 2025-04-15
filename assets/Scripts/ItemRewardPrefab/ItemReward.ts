import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemReward')
export class ItemReward extends Component {
    @property(Label)
    public amountLabel: Label; 
}


