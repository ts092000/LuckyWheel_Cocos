import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemHistory')
export class ItemHistory extends Component {
    @property(Label)
    public orderNumb: Label; 

    @property(Label)
    public phoneNumbLabel: Label; 

    @property(Label)
    public rewardNameLabel: Label; 
}

