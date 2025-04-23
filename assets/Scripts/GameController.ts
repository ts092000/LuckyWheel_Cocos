import { _decorator, assetManager, CCFloat, CCString, Color, Component, EditBox, ImageAsset, instantiate, math, misc, Node, randomRange, randomRangeInt, Size, Sprite, SpriteFrame, sys, Texture2D, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
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
    private turnInSection: number = 1;

    // Popup enter user
    private codeString: string = "";
    private degreeTarget: number[] = [];
    private degreeTarget2: number[] = [];

    // Information user in localstorage
    private userName: string = null;
    private phoneNumber: string = null;
    private code: string = null;

    private isTypeCode: boolean = false;

    // Dữ liệu tỷ lệ của các item (ví dụ: phần trăm)
    private itemRatios: number[] = [];
    
    @property(CCFloat)
    private wheelRadius: number = 100; // Adjust as needed

    @property(CCFloat)
    private numberOfItems: number = 6;

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
        // this.callAPIToCheckEventData();
    }

    protected start(): void {
        // this.GameView.SpinCircleSprite.spriteFrame = this.GameView.SpinCircleSpriteFrame[randomRangeInt(0, 4)];
        // this.instantiateLuckyWheelItems();
        // this.instantiateLuckyWheel();
        this.generateRandomRatios();
        this.instantiateLuckyWheelItems();
        // this.totalRatio = this.itemRatios.reduce((sum, ratio) => sum + ratio, 0);

        // this.calculateItemAngles();
        // this.positionItems();
        this.callAPIToSpin(true)
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
    private async checkInformationUser(): Promise<void> {
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
            await this.callAPIToSpin(true);
        }
    }
    


    // Do Animation Spin
    private startSpin(): void {
        console.log('start spin')
        if (this.isSpinning) {
            return;
        }
        this.isSpinning = true;
        this.GameModel.BtnSpin.interactable = false;
        const winningIndex = randomRangeInt(0, 6);
        const degreesPerElement = 360 / this.elementCount;
        // const targetRotationZ = - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement + degreesPerElement / 2)) * this.turnInSection;
        const targetRotationZ = (- (360 * this.finalSpinRotations + this.degreeTarget2[winningIndex]) - 1080 * this.turnInSection) 
        + randomRange(-this.degreeTarget[winningIndex] + 0.5, this.degreeTarget[winningIndex] - 0.5);
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
                // console.log('winId: ', winningIndex);
                // console.log('degreesPerElement: ', degreesPerElement);
                // console.log('targetRotationZ: ', targetRotationZ);
                // console.log('targetRotationZ 2: ',this.degreeTarget[winningIndex]);
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

    private generateRandomRatios(): void {
        this.itemRatios = [];
        let remainingRatio = 1.0;

        for (let i = 0; i < this.numberOfItems - 1; i++) {
            // Tạo một tỉ lệ ngẫu nhiên nhỏ hơn phần còn lại
            const randomRatio = math.randomRange(0.01, remainingRatio * 0.8); // Tránh tỉ lệ quá nhỏ hoặc quá lớn ở các bước đầu
            this.itemRatios.push(randomRatio);
            remainingRatio -= randomRatio;
        }
        // Gán phần còn lại cho ô cuối cùng
        this.itemRatios.push(remainingRatio);

        // Đảm bảo tổng tỉ lệ là 1 (có thể có sai số nhỏ do làm tròn số thực)
        const totalRatio = this.itemRatios.reduce((sum, ratio) => sum + ratio, 0);
        console.log("Generated Ratios:", this.itemRatios, "Total Ratio:", totalRatio);
    }

    private instantiateLuckyWheelItems(): void {
        if (!this.GameModel.ItemWheelPrefab2 || !this.GameModel.ItemWheelContainer) {
            console.error("Prefab phần tử hoặc Node cha chưa được gán!");
            return;
        }
        this.degreeTarget = [];
        let currentAngle = 0;
        const totalRatio = this.itemRatios.reduce((sum, ratio) => sum + ratio, 0);
        for (let i = 0; i < this.numberOfItems; i++) {
            const ratio = this.itemRatios[i] / totalRatio; // Đảm bảo tổng ratio là 1
            const angleIncrement = 360 * ratio;
            const sliceCenterAngle = currentAngle + angleIncrement;
            const sliceCenterAngle2 = currentAngle + angleIncrement - angleIncrement / 2;
            const angleRad = sliceCenterAngle * Math.PI / 180;
            const angleRad2 = sliceCenterAngle2 * Math.PI / 180;

            const newItem = instantiate(this.GameModel.ItemWheelPrefab2);
            if (this.GameModel.ItemWheelContainer) {
                let newItemComponent = newItem.getComponent(ItemWheel);
                newItem.parent = this.GameModel.ItemWheelContainer;
                newItemComponent.labelItemWheel.string = `${i + 1}`;
                if (i % 2 === 0) newItemComponent.spriteBg.color = Color.WHITE;
                else newItemComponent.spriteBg.color = Color.RED;
                // Tính toán vị trí trên đường tròn (tâm của phần tử)
                const labelRadius = this.wheelRadius * 1.5; // Đặt label gần tâm hơn một chút
                const labelRadius2 = this.wheelRadius * 1; // Đặt label gần tâm hơn một chút
                const x = labelRadius * Math.sin(angleRad2);
                const y = labelRadius * Math.cos(angleRad2);
                const x2 = labelRadius2 * Math.sin(angleRad2);
                const y2 = labelRadius2 * Math.cos(angleRad2);
                newItemComponent.labelItemWheel.node.setPosition(new Vec3(-x, y, 0));
                newItemComponent.spriteItemReward.node.setPosition(new Vec3(-x2, y2, 0));

                // Xoay label để nó vuông góc với tâm
                newItemComponent.labelItemWheel.node.eulerAngles = new Vec3(0, 0, sliceCenterAngle2);
                newItemComponent.spriteItemReward.node.eulerAngles = new Vec3(0, 0, sliceCenterAngle2);

                // Xoay phần tử để hướng vào tâm của lát cắt
                newItemComponent.nodeBg.eulerAngles = new Vec3(newItem.eulerAngles.x, newItem.eulerAngles.y, sliceCenterAngle);
                newItemComponent.progressBarItemWheel.progress = this.itemRatios[i];

                // Lưu trữ góc bắt đầu và kết thúc của phần tử (có thể dùng cho việc xác định phần trúng thưởng)
                newItem['startAngle'] = currentAngle;
                newItem['endAngle'] = currentAngle + angleIncrement;
                this.degreeTarget.push(angleIncrement/2);
                currentAngle += angleIncrement;
                this.degreeTarget2.push(currentAngle - angleIncrement/2)
            }
        }
    }

    fitItemToSize(itemNode: Node, targetSize: Size) {
        const sprite = itemNode.getComponent(Sprite);
        if (sprite && sprite.spriteFrame) {
            const originalSize = sprite.spriteFrame.rect.size;
            const scaleX = targetSize.width / originalSize.width;
            const scaleY = targetSize.height / originalSize.height;
            itemNode.setScale(scaleX, scaleY, 1);
        } else {
            console.warn("Item node does not have a Sprite component with a SpriteFrame to determine original size.");
            if (itemNode.getComponent(Sprite)!.spriteFrame!.rect.width > 0 && itemNode.getComponent(Sprite)!.spriteFrame!.rect.height > 0) {
                itemNode.setScale(targetSize.width / itemNode.getComponent(Sprite)!.spriteFrame!.rect.width, targetSize.height / itemNode.getComponent(Sprite)!.spriteFrame!.rect.height, 1);
            } else {
                console.warn("Could not determine original size of the item node for scaling.");
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
        
        for (let i = 0; i < this.elementCount; i++) {
            let angleIncrement = totalAngle / this.elementCount;
            const newItem = instantiate(this.GameModel.ItemWheelPrefab);
            if (this.GameModel.ItemWheelContainer) {
                let newItemComponent = newItem.getComponent(ItemWheel);
                newItem.parent = this.GameModel.ItemWheelContainer;
                newItemComponent.labelItemWheel.string = `${i + 1}`;
                // Calculate the angle for this item
                const currentAngleRad = (i * angleIncrement) * Math.PI / 180;

                // this.angleIncrement += angleIncrement;
                if (i % 2 === 0) newItemComponent.spriteBg.color = Color.WHITE;
                else newItemComponent.spriteBg.color = Color.RED;
                // Calculate the position based on the angle and radius
                let x: number;
                let y: number;
                if (i === 0) {
                    x = 92 * Math.sin(currentAngleRad);
                    y = 92 * Math.cos(currentAngleRad);
                } 
                else {
                    x = 92 * Math.sin(currentAngleRad);
                    y = 90 * Math.cos(currentAngleRad);
                }
                // newItem.__edi
                newItem.setPosition(new Vec3(x, y, 0));
                // Optionally, you can rotate the item to face outwards
                // console.log(i);
                // console.log(this.totalLastRad);
                // if (i === 0) newItem.angle = 0;
                // else {
                //     let x = this.itemRatios[i] / this.itemRatios[0]
                //     newItem.setScale(newItem.scale.x * x, newItem.scale.y);
                //     this.totalLastRad -= angleIncrement;
                //     newItem.angle = this.totalLastRad + angleIncrement - this.lastAngleIncrement / 2;
                // }
                // this.lastAngleIncrement = angleIncrement
                // console.log(this.lastAngleIncrement);
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

    private async callAPIToSpin(isCode: boolean): Promise<void> {
        try {
            const url =  new URL(location.href);
            // const eventId = url.searchParams.get("eventId");
            // if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/spin`; //dev
            let body: object;
            if (isCode) {
                body = {
                    'phone': `${this.phoneNumber}`,
                    'name': `${this.userName}`,
                    'eventId': '68086dabdce7d49d04493d85',
                    'codeId': '68060630b34b3de021c569ea'
                }
            } else {
                body = {
                    'phone': `${this.phoneNumber}`,
                    'name': `${this.userName}`,
                    'eventId': '68086dabdce7d49d04493d85',
                }
            }
            const requestOptions = {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }

            fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                })
                .then(data => {
                    console.log(data)
                    this.GameView.LoadingNode.active = false;
                    this.GameView.LoadingAnim.stop();
                    this.startSpin();
                })
                .catch(error => {
                    console.log('e:' , error);
                }) 
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


