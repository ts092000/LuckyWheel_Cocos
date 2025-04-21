import { _decorator, assetManager, CCFloat, CCString, Color, Component, EditBox, ImageAsset, instantiate, Node, randomRange, randomRangeInt, SpriteFrame, sys, Texture2D, tween, Tween, Vec2, Vec3 } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameAPI } from './GameAPI';
import { ItemReward } from './ItemRewardPrefab/ItemReward';
import { ItemWheel } from './ItemRewardPrefab/ItemWheel';
import { AudioController } from './AudioController';
import env from './env-config';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(GameModel)
    private GameModel: GameModel;

    @property(GameView)
    private GameView: GameView;

    @property(GameAPI)
    private GameAPI: GameAPI;

    @property(AudioController)
    private AudioController: AudioController;

    @property(CCFloat)
    private speed: number = 0;

    // @property({ type: CCFloat, tooltip: 'Duration of the initial right spin (in seconds)', min: 0.1 })
    // initialRightSpinDuration: number = 0.5;

    // @property({ type: CCFloat, tooltip: 'Rotation angle for the initial right spin', min: 1 })
    // initialRightSpinAngle: number = 720; // At least 2 full rotations to the right

    @property({ type: CCFloat, tooltip: 'Duration of the final spin (in seconds)', min: 0.1 })
    private finalSpinDuration: number = 1000;

    @property({ type: CCFloat, tooltip: 'Number of additional full rotations during the final spin', min: 0 })
    private finalSpinRotations: number = 5;

    @property(CCString)
    private imageUrl: string = "";

    private isSpinning: boolean = false;
    private elementCount: number = 12;
    private targetRotationZ: number = 0;
    private turnInSection: number = 1;

    // Popup enter user
    private nameString: string = "";
    private phoneNumberString: string = "";
    private codeString: string = "";

    // Information user in localstorage
    private userName: string = null;
    private phoneNumber: string = null;
    private code: string = null;

    private isTypeCode: boolean = false;

    protected onLoad(): void {
        this.GameView.FrameDarkFull.active = true;
        this.checkTypeHistoryReward(true);
        this.loadImageSprite(this.imageUrl);
        this.checkLocalStorageUser();
        this.checkTypeCode()
        this.GameView.PopupEnterInfoUserNode.active = false;
        this.GameModel.EditBoxName.node.on('editing-did-began', this.editBeganName, this);
        this.GameModel.EditBoxName.node.on('text-changed', this.textChanged, this);
        this.GameModel.EditBoxName.node.on('editing-did-ended', this.editEnded, this);
        this.callAPIToCheckEventData();
    }

    protected start(): void {
        // this.GameView.SpinCircleSprite.spriteFrame = this.GameView.SpinCircleSpriteFrame[randomRangeInt(0, 4)];
        // this.instantiateLuckyWheelItems();
        this.instantiateLuckyWheel()
    }

    protected update(dt: number): void {
        // this.GameModel.SpinNode.angle -= this.speed;
    }

    //----Check Status of Popup
    private PopupInfoStatus(event: Event, customEventData: string): void {
        if (customEventData === '0') {
            this.AudioController.soundGame.stop();
            this.GameModel.BtnClosePopup.interactable = false;
            this.GameModel.BtnClosePopup2.interactable = false;
            this.GameView.PopupShowRewardNode.active = false;
            this.GameView.RewardTable.setScale(new Vec3(0, 0, 1));
        }
        else this.GameView.PopupShowRewardNode.active = true;
    }

    private PopupInfoUserStatus(event: Event, customEventData: string): void {
        if (customEventData === '0') {
            this.GameView.PopupEnterInfoUserNode.active = false;
            this.userName = null;
            this.phoneNumber = null;
        }
        else this.GameView.PopupEnterInfoUserNode.active = true;
    }
    //-------

    //Check information user
    private checkInformationUser(): void {
        if (!this.userName && !this.phoneNumber) {
            this.GameView.PopupEnterInfoUserNode.active = true;
            this.GameView.PopupEnterInfoUserTableNode.position =  new Vec3(0, 780);
            this.GameModel.EditBoxCode.string = this.GameModel.EditBoxName.string
            = this.GameModel.EditBoxPhoneNumber.string = "";
            let newTween2 = tween(this.GameView.PopupEnterInfoUserTableNode)
                            .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
                            .start();
                console.log(this.userName);
                console.log(this.phoneNumber);

        }    
        else { 
            this.GameView.PopupEnterInfoUserNode.active = false;
            this.GameView.LoadingNode.active = true;
            this.GameView.LoadingAnim.play();
            setTimeout(() => {
                this.GameView.LoadingNode.active = false;
                this.GameView.LoadingAnim.stop();
                this.startSpin();
            }, 1000);
        }
    }

    // Do Animation Spin
    private startSpin(): void {
        if (this.isSpinning) {
            return;
        }
        // this.GameView.LoadingNode.active = true;
        // this.GameView.LoadingAnim.play();
        this.isSpinning = true;
        this.GameModel.BtnSpin.interactable = false;
        const winningIndex = randomRangeInt(0, 12);
        const degreesPerElement = 360 / this.elementCount;
        // const targetRotationZ = - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement + degreesPerElement / 2)) * this.turnInSection;
        const targetRotationZ = (+ (360 * this.finalSpinRotations + (winningIndex * degreesPerElement )) + 1080 * this.turnInSection) + randomRange(-13, 13);
        setTimeout(() => {
            this.AudioController.playSoundGame(this.AudioController.soundGameList[0]);
        }, 1500);
        // Final spin
        let spinTween2 = tween(this.GameModel.SpinNode)
            .to(this.finalSpinDuration, { eulerAngles: new Vec3(0, 0, targetRotationZ) }, { easing: "cubicInOut" })
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
                this.AudioController.playSoundGame(this.AudioController.soundGameList[1]);
                let newTween = tween(this.GameView.RewardTable).to(0.5, {scale: new Vec3(1, 1, 1)}).start();
                this.GameView.LabelCongrats.string = `Chúc mừng bạn trúng phần thưởng ${winningIndex + 1}`;
                setTimeout(() => {
                    this.GameModel.BtnClosePopup.interactable = true;
                    this.GameModel.BtnClosePopup2.interactable = true;
                    this.GameModel.BtnSpin.interactable = true;
                }, 510);
            })
            .start();
            // setTimeout(() => {
            //     this.GameView.LoadingNode.active = false;
            //     this.GameView.LoadingAnim.stop();
            // }, 1500);
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
                if (i % 2 === 0) newItemComponent.spriteItemWheel.color = Color.WHITE;
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

    private checkTypeHistoryReward(isHistoryActive: boolean): void {
        this.GameView.HistoryRewardNode.active = isHistoryActive;
        if (isHistoryActive) this.GameView.LuckyWheelNode.position = new Vec3(570, -90, this.GameView.LuckyWheelNode.position.z)
        else this.GameView.LuckyWheelNode.position = new Vec3(50, -90, this.GameView.LuckyWheelNode.position.z)
    }

    private checkTypeCode(): void {
        this.GameView.InformationUserCodeOutside.active = this.isTypeCode;
        this.GameModel.CodeNodeInPopupEnterUser.active = this.isTypeCode;
        // if (this.isTypeCode) {
        // } else {
        //     this.GameView.LabelUserCode.node.active = true;
        //     this.GameModel.CodeNodeInPopupEnterUser.active = true;
        // }
    }

    private async checkLocalStorageUser(): Promise<void> {
        this.userName = sys.localStorage.getItem('userDataName');
        this.phoneNumber = sys.localStorage.getItem('userDataPhoneNumber');
        if (!this.userName && !this.phoneNumber) {
            this.userName = null;
            this.phoneNumber = null;
            this.GameView.InformationUserOutside.active = false;
        }    
        else {
            this.GameView.InformationUserOutside.active = true;
            this.GameView.LabelUserName.string = this.userName;
            this.GameView.LabelUserPhoneNumber.string = this.phoneNumber;
            // this.GameView.LabelUserCode.string = this.codeString;
        }
    }

    private async callAPIToCheckEventData(): Promise<void> {
        // let type: string = '';
        try {
            const url =  new URL(location.href);
            const eventId = url.searchParams.get("eventId");
            if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/admin/events/${eventId}`; //dev
            const requestOptions = {
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            }

            this.GameAPI.fetchAPI(apiUrl, requestOptions).then(() => {
                // Set data localstorage
            })
        } catch (error) {
            console.log(error)
        }
    }

    private async callAPIToSpin(): Promise<void> {
        try {
            const url =  new URL(location.href);
            const eventId = url.searchParams.get("eventId");
            if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/admin/events/${eventId}/gift`; //dev
            const requestOptions = {
                method: "GET",
                headers: {
                    'accept': 'application/json'
                }
            }

            this.GameAPI.fetchAPI(apiUrl, requestOptions)
        } catch (error) {
            console.log(error)
        }
    }

    private setDataLocalStorage(): void {
        if (this.userName != "" && this.phoneNumber != "") {
            sys.localStorage.setItem('userDataName', this.userName);
            sys.localStorage.setItem('userDataPhoneNumber', this.phoneNumber);
        }
    }

    private editBeganName(editbox: EditBox, customEventData: string){
        // The callback parameter is the EditBox component, note that events registered this way cannot pass customEventData.
        // this.GameModel.LabelOutlineNamePlaceHolder.color = Color.BLACK;
        // console.log('123123')
        editbox.string = "";
        // console.log(editbox)
    }

    private textChanged(text: string, editbox: EditBox, customEventData: string){
        // The callback parameter is the EditBox component, note that events registered this way cannot pass customEventData.
        // this.GameModel.LabelOutlineNamePlaceHolder.color = Color.BLACK;
        // console.log('text changed');
        // console.log(text)
        // console.log(editbox); 
    }

    private editEnded(editbox: EditBox, customEventData: string){
        // The callback parameter is the EditBox component, note that events registered this way cannot pass customEventData.
        // this.GameModel.LabelNamePlaceHolder.color = Color.WHITE;
        switch (customEventData) {
            case '1':
                this.GameModel.LabelNameInEditBox.color = Color.WHITE;
                if (editbox.string != "") this.userName = editbox.string;
                else this.userName = null;
                console.log(this.userName);
                break;
            case '2':
                this.GameModel.LabelPhoneNumberInEditBox.color = Color.WHITE;
                if (editbox.string != "") this.phoneNumber = editbox.string;
                else this.phoneNumber = null;
                console.log(this.phoneNumber);
                break;
            case '3':
                this.GameModel.LabelCodeInEditBox.color = Color.WHITE;
                if (editbox.string != "") this.codeString = editbox.string;
                console.log(this.codeString);
                break;
            default:
                break;
        }
    }

    private onClickConfirmUserInfo(): void {
        if (this.phoneNumber != "" && this.userName != "" && this.phoneNumber != null && this.userName != null) {
            this.GameView.LoadingNode.active = true;
            this.GameView.LoadingAnim.play();
            setTimeout(() => {
                this.GameView.LoadingNode.active = false;
                this.GameView.LoadingAnim.stop();
                this.GameView.PopupEnterInfoUserNode.active = false;
                this.setDataLocalStorage();
                this.startSpin();
                this.GameView.InformationUserOutside.active = true;
                this.GameView.LabelUserName.string = this.userName;
                this.GameView.LabelUserPhoneNumber.string = this.phoneNumber;
                this.GameView.LabelUserCode.string = this.codeString;
            }, 1000);
        } else {
            alert('Hay nhap day du thong tin')
        }
    }
}


