import { _decorator, assetManager, CCFloat, CCString, Color, Component, ImageAsset, instantiate, Node, randomRangeInt, SpriteFrame, Texture2D, tween, Tween, Vec2, Vec3 } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameAPI } from './GameAPI';
import { ItemReward } from './ItemRewardPrefab/ItemReward';
import { ItemWheel } from './ItemRewardPrefab/ItemWheel';
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

    @property({ type: CCFloat, tooltip: 'Duration of the initial right spin (in seconds)', min: 0.1 })
    initialRightSpinDuration: number = 0.5;

    @property({ type: CCFloat, tooltip: 'Rotation angle for the initial right spin', min: 1 })
    initialRightSpinAngle: number = 720; // At least 2 full rotations to the right

    @property({ type: CCFloat, tooltip: 'Duration of the final spin (in seconds)', min: 0.1 })
    private finalSpinDuration: number = 5;

    @property({ type: CCFloat, tooltip: 'Number of additional full rotations during the final spin', min: 0 })
    private finalSpinRotations: number = 3;

    @property(CCString)
    private imageUrl: string = "";

    private isSpinning: boolean = false;
    private elementCount: number = 12;
    private targetRotationZ: number = 0;
    private turnInSection: number = 0;

    protected onLoad(): void {
        this.GameView.FrameDarkFull.active = true;
        this.loadImageSprite(this.imageUrl);
    }

    protected start(): void {
        // this.GameView.SpinCircleSprite.spriteFrame = this.GameView.SpinCircleSpriteFrame[randomRangeInt(0, 4)];
        // this.instantiateLuckyWheelItems();
        this.instantiateLuckyWheel()
    }

    protected update(dt: number): void {
        this.GameModel.SpinNode.angle -= this.speed;
    }

    //----Check Status of Popup
    private PopupInfoStatus(event: Event, customEventData: string): void {
        if (customEventData === '0') {
            this.GameModel.BtnClosePopup.interactable = false;
            this.GameModel.BtnClosePopup2.interactable = false;
            this.GameView.PopupShowRewardNode.active = false;
            this.GameView.RewardTable.setScale(new Vec3(0, 0, 1));
        }
        else this.GameView.PopupShowRewardNode.active = true;
    }

    private PopupInfoUserStatus(event: Event, customEventData: string): void {
        if (customEventData === '0') this.GameView.PopupEnterInfoUserNode.active = false;
        else this.GameView.PopupEnterInfoUserNode.active = true;
    }
    //-------

    // Do Animation Spin
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

    // Instantiate Lucky Wheel 
    private instantiateLuckyWheel(): void {
        if (!this.GameModel.ItemWheelPrefab || !this.GameModel.ItemWheelContainer) {
            console.error("Item Prefab or Items Parent not assigned!");
            return;
        }

        const totalAngle = 360;
        const angleIncrement = totalAngle / this.elementCount;

        for (let i = 0; i < this.elementCount; i++) {
            const newItem = instantiate(this.GameModel.ItemWheelPrefab);
            if (this.GameModel.ItemWheelContainer) {
                let newItemComponent = newItem.getComponent(ItemWheel);
                newItem.parent = this.GameModel.ItemWheelContainer;
                newItemComponent.labelItemWheel.string = `${i + 1}`;
                // Calculate the angle for this item
                const currentAngleRad = (i * angleIncrement) * Math.PI / 180;
                if (i % 2 === 0) newItemComponent.spriteItemWheel.color = Color.BLUE;
                else newItemComponent.spriteItemWheel.color = Color.RED;
                // Calculate the position based on the angle and radius
                let x: number;
                let y: number;
                if (i === 0) {
                    x = 91 * Math.sin(currentAngleRad);
                    y = 91 * Math.cos(currentAngleRad);
                } 
                else {
                    x = 91 * Math.sin(currentAngleRad);
                    y = 89 * Math.cos(currentAngleRad);
                }

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

    // Load image from URL
    private async loadImageSprite(url: string) {
        assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
            if (err) {
                console.error("Error loading image from URL:", err);
                return;
            }

            const texture = new Texture2D();
            texture.image = imageAsset;
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;

            this.GameView.BgSprite.spriteFrame = spriteFrame;
            this.GameView.FrameDarkFull.active = false;
        });
    }
}


