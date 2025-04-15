import { _decorator, CCFloat, Component, instantiate, Node, randomRangeInt, tween, Tween, Vec2, Vec3 } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameAPI } from './GameAPI';
import { ItemReward } from './ItemRewardPrefab/ItemReward';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(GameModel)
    private GameModel: GameModel;

    @property(GameView)
    private GameView: GameView;

    @property(GameAPI)
    private GameAPI: GameAPI;

    private speed: number = 0;

    // private intervalLuckyWheel: number = null;

    // private numberOfReward: number = 6;
    // private numberRandom: number = 0;
    // private randomDeg: number = 0;

    // @property({ type: CCFloat, tooltip: 'Duration of the spin animation (in seconds)', min: 0.1 })
    // private spinDuration: number = 3;

    // @property({ type: CCFloat, tooltip: 'Number of full rotations during the spin', min: 1 })
    // private spinRotations: number = 5;

    // @property({ type: CCFloat, tooltip: 'Easing type for the spin animation' })
    // private spinEase: number = 2; // Example: cc.easing.cubicOut

    @property({ type: CCFloat, tooltip: 'Duration of the initial right spin (in seconds)', min: 0.1 })
    initialRightSpinDuration: number = 0.5;

    @property({ type: CCFloat, tooltip: 'Rotation angle for the initial right spin', min: 1 })
    initialRightSpinAngle: number = 720; // At least 2 full rotations to the right

    @property({ type: CCFloat, tooltip: 'Duration of the final spin (in seconds)', min: 0.1 })
    private finalSpinDuration: number = 5;

    @property({ type: CCFloat, tooltip: 'Number of additional full rotations during the final spin', min: 0 })
    private finalSpinRotations: number = 3;

    private isSpinning: boolean = false;
    private elementCount: number = 12;
    private targetRotationZ: number = 0;
    private turnInSection: number = 0;

    protected start(): void {
        this.GameView.SpinCircleSprite.spriteFrame = this.GameView.SpinCircleSpriteFrame[randomRangeInt(0, 4)];
        this.instantiateLuckyWheelItems();
    }

    protected update(dt: number): void {
        this.GameModel.SpinNode.angle -= this.speed;
    }

    private PopupInfoStatus(event: Event, customEventData: string): void {
        if (customEventData === '0') {
            this.GameModel.BtnClosePopup.interactable = false;
            this.GameModel.BtnClosePopup2.interactable = false;
            this.GameView.PopupShowRewardNode.active = false;
            this.GameView.RewardTable.setScale(new Vec3(0, 0, 1));
        }
        else this.GameView.PopupShowRewardNode.active = true;
    }

    private startSpin(): void {
        if (this.isSpinning) {
            return;
        }
        this.isSpinning = true;
        this.GameModel.BtnSpin.interactable = false;
        const winningIndex = randomRangeInt(0, 12);
        const degreesPerElement = 360 / this.elementCount;
        // const targetRotationZ = - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement + degreesPerElement / 2)) * this.turnInSection;
        const targetRotationZ = + (360 * this.finalSpinRotations + (winningIndex * degreesPerElement )) + 1080 * this.turnInSection;

        // Final spin
        let spinTween2 = tween(this.GameModel.SpinNode)
            .to(this.finalSpinDuration, { eulerAngles: new Vec3(0, 0, targetRotationZ) }, { easing: "cubicOut" })
            .call(() => {
                this.isSpinning = false;
                this.GameView.RewardTable.setScale(new Vec3(0, 0, 1));
                this.turnInSection += 3;
                console.log(this.elementCount);
                console.log('winId: ', winningIndex);
                console.log('degreesPerElement: ', degreesPerElement);
                console.log('targetRotationZ: ', targetRotationZ);
                console.log('targetRotationZ 2: ', - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement )));
                // this.handleSpinResult(winningIndex);
                this.GameView.PopupShowRewardNode.active = true;
                let newTween = tween(this.GameView.RewardTable).to(0.5, {scale: new Vec3(1, 1, 1)}).start();
                setTimeout(() => {
                    this.GameModel.BtnClosePopup.interactable = true;
                    this.GameModel.BtnClosePopup2.interactable = true;
                    this.GameModel.BtnSpin.interactable = true;
                }, 510);
            })
            .start();
            
    }

    //     handleSpinResult(index: number) {
    //         if (this.resultLabel) {
    //             this.resultLabel.string = `Congratulations! You won: ${this.prizes[index]}`;
    //         }
    //         console.log(`Won: ${this.prizes[index]}`);
    //         // You can add more logic here, like emitting an event or triggering other actions
    //     }
    // }

    private instantiateLuckyWheelItems(): void {
        if (!this.GameModel.ItemRewardPrefab || !this.GameModel.ItemRewardContainer) {
            console.error("Item Prefab or Items Parent not assigned!");
            return;
        }

        const totalAngle = 360;
        const angleIncrement = totalAngle / this.elementCount;

        for (let i = 0; i < this.elementCount; i++) {
            const newItem = instantiate(this.GameModel.ItemRewardPrefab);
            if (this.GameModel.ItemRewardContainer) {
                let newItemComponent = newItem.getComponent(ItemReward);
                newItem.parent = this.GameModel.ItemRewardContainer;
                newItemComponent.amountLabel.string = `${i + 1}`;
                // Calculate the angle for this item
                const currentAngleRad = (i * angleIncrement) * Math.PI / 180;

                // Calculate the position based on the angle and radius
                const x = 150 * Math.sin(currentAngleRad);
                const y = 150 * Math.cos(currentAngleRad);

                newItem.setPosition(new Vec3(x, y, 0));

                // Optionally, you can rotate the item to face outwards
                newItem.angle -= i * angleIncrement;

                // You can also access components of the instantiated item here
                // For example, to set the text or image of the item
                // const itemLabel = newItem.getComponent(Label);
                // if (itemLabel) {
                //     itemLabel.string = `Item ${i + 1}`;
                // }
            }
        }
    }
}


