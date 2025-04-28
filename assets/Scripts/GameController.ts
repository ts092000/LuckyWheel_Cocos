import { _decorator, assetManager, CCFloat, CCString, Color, Component, EditBox, ImageAsset, instantiate, Label, math, misc, Node, randomRange, randomRangeInt, Size, Sprite, SpriteFrame, sys, Texture2D, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameAPI } from './GameAPI';
import { ItemReward } from './ItemRewardPrefab/ItemReward';
import { ItemWheel } from './ItemRewardPrefab/ItemWheel';
import { AudioController } from './AudioController';
import env from './env-config';
import { ItemHistory } from './ItemRewardPrefab/ItemHistory';
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

    @property({ type: CCFloat, tooltip: 'Duration of the final spin (in seconds)', min: 0.1 })
    private finalSpinDuration: number = 1000;

    @property({ type: CCFloat, tooltip: 'Number of additional full rotations during the final spin', min: 0 })
    private finalSpinRotations: number = 5;

    @property(CCString)
    private imageUrl: string = "";

    private isSpinning: boolean = false;
    private turnInSection: number = 2;

    // Popup enter user
    private codeString: string = null
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

    private idList: any[] = [];

    private numberOfItems: number = 0;

    private isCode: boolean = false;

    protected onLoad(): void {
        this.GameView.InformationRemainingCountOutside.active = false;
        this.GameView.FrameDarkFull.active = true;
        
        // this.displayDefaultUI();

        // this.loadImageSprite(this.imageUrl);
        this.checkLocalStorageUser();
        this.callAPIToCheckEventData();
        this.callAPIToCheckEventHistoryReward();
        // this.instantiateLuckyWheelItems();
        this.GameView.PopupEnterInfoUserNode.active = false;
        this.GameModel.EditBoxName.node.on('editing-did-began', this.editBeganName, this);
        this.GameModel.EditBoxName.node.on('text-changed', this.textChanged, this);
        this.GameModel.EditBoxName.node.on('editing-did-ended', this.editEnded, this);
        // this.callAPIToCheckEventData();
        // this.handleImageDownload(this.imageUrl, this.GameView.BgSprite);
        // this.handleDownload(this.imageUrl);
        // this.GetSpriteFromUrl(this.imageUrl)
    }

    protected start(): void {
        // this.GameView.SpinCircleSprite.spriteFrame = this.GameView.SpinCircleSpriteFrame[randomRangeInt(0, 4)];
        // this.instantiateLuckyWheelItems();
        // this.instantiateLuckyWheel();
        
        // this.totalRatio = this.itemRatios.reduce((sum, ratio) => sum + ratio, 0);

        // this.calculateItemAngles();
        // this.positionItems();
        // this.callAPIToSpin(true)
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
        if (this.isCode) {
            if (!this.userName && !this.phoneNumber && !this.codeString) {
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
                await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, this.codeString);
                // await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, '68060630b34b3de021c569ea');//local
            }
        }
        else {
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
                await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, this.codeString);
                // await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, '68060630b34b3de021c569ea');//local
            }
        }
    }
    


    // Do Animation Spin
    private startSpin(data: any): void {
        // console.log('start spin')
        if (this.isSpinning) {
            return;
        }
        console.log('start spin 2')
        this.isSpinning = true;
        this.GameModel.BtnSpin.interactable = false;
        const winningIndex = this.idList.indexOf(data?.data?.award?._id);
        console.log(winningIndex)
        console.log(this.idList)
        // const targetRotationZ = - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement + degreesPerElement / 2)) * this.turnInSection;
        let targetRotationZ = (- (360 * this.finalSpinRotations + this.degreeTarget2[winningIndex]) - 1080 * this.turnInSection) 
        + randomRangeInt(-this.degreeTarget[winningIndex] + 0.5, this.degreeTarget[winningIndex] - 0.5);
        // console.log(this.degreeTarget[winningIndex]);
        // console.log(this.degreeTarget2[winningIndex]);
        // console.log(this.degreeTarget);
        // console.log(this.degreeTarget2);
        // console.log(targetRotationZ);
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
                let newTween = tween(this.GameView.RewardTable).to(0.5, {scale: new Vec3(1.2, 1.2, 1)}).start();
                this.GameView.LabelCongrats.string = `Chúc mừng bạn đã trúng thưởng`;
                this.GameView.RewardInPopupSpriteLabel.string = `${data?.data?.award?.name}`;
                Color.fromHEX(this.GameView.LabelCongrats.color, data?.data?.award?.colorText);
                Color.fromHEX(this.GameView.RewardInPopupSpriteLabel.color, data?.data?.award?.colorText);
                // this.loadImageSprite(data?.data?.award?.imgUrl, this.GameView.RewardInPopupSprite);
                setTimeout(() => {
                    this.callAPIToCheckEventHistoryReward();

                    this.GameModel.BtnClosePopup.interactable = true;
                    this.GameModel.BtnClosePopup2.interactable = true;
                    this.GameModel.BtnSpin.interactable = true;
                }, 510);
            })
            .start();
    }

    private instantiateLuckyWheelItems(data: any): void {
        if (!this.GameModel.ItemWheelPrefab2 || !this.GameModel.ItemWheelContainer) {
            console.error("Prefab phần tử hoặc Node cha chưa được gán!");
            return;
        }
        this.GameModel.ItemRewardContainer.removeAllChildren();
        this.numberOfItems = data?.data?.awards?.length;
        this.GameView.WheelNameLabel.string = data?.data?.event?.name;
        this.degreeTarget = [];
        this.degreeTarget2 = [];
        this.idList = [];
        let currentAngle = 0;
        for (let i = 0; i < this.numberOfItems; i++) {
            this.idList.push(data?.data?.awards[i]?._id)
            const ratio = data?.data?.awards[i]?.viewRate;
            const angleIncrement = 360 * ratio;
            const sliceCenterAngle = currentAngle + angleIncrement;
            const sliceCenterAngle2 = currentAngle + angleIncrement - angleIncrement / 2;
            const angleRad = sliceCenterAngle * Math.PI / 180;
            const angleRad2 = sliceCenterAngle2 * Math.PI / 180;
            const viewSizeAwardSprite = 1 * ratio / 0.6
            const newItem = instantiate(this.GameModel.ItemWheelPrefab2);
            if (this.GameModel.ItemWheelContainer) {
                let newItemComponent = newItem.getComponent(ItemWheel);
                newItem.parent = this.GameModel.ItemWheelContainer;
                newItemComponent.spriteItemReward.node.setScale(new Vec3(viewSizeAwardSprite, viewSizeAwardSprite, 1));
                newItemComponent.richTextItemWheel.string = `<color=${data?.data?.awards[i]?.colorText}><outline color=${data?.data?.awards[i]?.background} width=3>${data?.data?.awards[i]?.name}</outline></color> `;
                // this.loadImageSprite(data?.data?.awards[i]?.imgUrl, newItemComponent.spriteItemReward);
                Color.fromHEX(newItemComponent.labelItemWheel.color, `${data?.data?.awards[i]?.colorText}`);
                Color.fromHEX(newItemComponent.spriteItemWheel.color, `${data?.data?.awards[i]?.background}`);

                // Tính toán vị trí trên đường tròn (tâm của phần tử)
                const labelRadius = this.wheelRadius * 1.5; // Đặt label gần tâm hơn một chút
                const labelRadius2 = this.wheelRadius * 1; // Đặt label gần tâm hơn một chút
                const x = labelRadius * Math.sin(angleRad2);
                const y = labelRadius * Math.cos(angleRad2);
                const x2 = labelRadius2 * Math.sin(angleRad2);
                const y2 = labelRadius2 * Math.cos(angleRad2);
                newItemComponent.labelItemWheel.node.setPosition(new Vec3(-x, y, 0));
                newItemComponent.richTextItemWheel.node.setPosition(new Vec3(-x, y, 0));
                newItemComponent.spriteItemReward.node.setPosition(new Vec3(-x2, y2, 0));

                // Xoay label để nó vuông góc với tâm
                newItemComponent.labelItemWheel.node.eulerAngles = 
                newItemComponent.richTextItemWheel.node.eulerAngles = 
                newItemComponent.spriteItemReward.node.eulerAngles = new Vec3(0, 0, sliceCenterAngle2);

                // Xoay phần tử để hướng vào tâm của lát cắt
                newItemComponent.nodeBg.eulerAngles = new Vec3(newItem.eulerAngles.x, newItem.eulerAngles.y, sliceCenterAngle);
                newItemComponent.progressBarItemWheel.progress = ratio;

                // Lưu trữ góc bắt đầu và kết thúc của phần tử (có thể dùng cho việc xác định phần trúng thưởng)
                newItem['startAngle'] = currentAngle;
                newItem['endAngle'] = currentAngle + angleIncrement;
                this.degreeTarget.push(angleIncrement/2);
                currentAngle += angleIncrement;
                this.degreeTarget2.push(currentAngle - angleIncrement/2)
            }
        }
        console.log('id list: ', this.idList)
    }

    // Load image from URL
    private async loadImageSprite(url: string, sprite: Sprite) {
        assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
            if (err) {
                console.error("Error loading image from URL:", err);
                return;
            }

            const texture = new Texture2D();
            texture.image = imageAsset;
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;

            sprite.spriteFrame = spriteFrame;
            this.GameView.FrameDarkFull.active = false;
        });
    }

    private checkTypeHistoryReward(isHistoryActive: boolean): void {
        this.GameView.HistoryRewardNode.active = isHistoryActive;
        if (isHistoryActive) this.GameView.LuckyWheelNode.position = new Vec3(550, -90, this.GameView.LuckyWheelNode.position.z)
        else this.GameView.LuckyWheelNode.position = new Vec3(50, -90, this.GameView.LuckyWheelNode.position.z)
    }

    private checkTypeCode(): void {
        this.GameView.InformationUserCodeOutside.active = this.isCode;
        this.GameModel.CodeNodeInPopupEnterUser.active = this.isCode;
    }

    private async checkLocalStorageUser(): Promise<void> {
        this.userName = sys.localStorage.getItem('userDataName');
        this.phoneNumber = sys.localStorage.getItem('userDataPhoneNumber');
        this.codeString = sys.localStorage.getItem('codeString');
        if (!this.userName && !this.phoneNumber) {
            this.userName = null;
            this.phoneNumber = null;
            this.GameView.InformationUserOutside.active = false;
        }    
        else {
            this.activeInforUserOutside();
        }
    }

    private instantiateHistoryRewardEvent(data: any): void {
        if (!this.GameModel.ItemWRewardHistoryPrefab || !this.GameModel.ItemRewardHistoryContainer) {
            console.error("Prefab phần tử hoặc Node cha chưa được gán!");
            return;
        }

        this.GameModel.ItemRewardHistoryContainer.removeAllChildren();
        // this.GameModel.ScrollViewHistory.scrollToTop(0.5, false)
        for (let i = 0; i < data?.data?.length; i++) {
            const newItem = instantiate(this.GameModel.ItemWRewardHistoryPrefab);
            if (this.GameModel.ItemRewardHistoryContainer) {
                let newItemComponent = newItem.getComponent(ItemHistory);
                newItem.parent = this.GameModel.ItemRewardHistoryContainer;
                newItem.setPosition(0, - 100 * i);
                newItemComponent.orderNumb.string = `${i + 1}.`;
                newItemComponent.phoneNumbLabel.string = `${data?.data[i]?.award?.name}`;
                newItemComponent.rewardNameLabel.string = `${data?.data[i]?.customer?.phone}`;
                console.log(i)
            }
        }
    }

    private async callAPIToCheckEventData(): Promise<void> {
        try {
            const url =  new URL(location.href);
            const eventId = url.searchParams.get("eventId");
            if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/event/${eventId}`; //dev
            // let apiUrl = `${env.API_URL_DEV}/lucky-wheel/event/680a0e60dfdd7a18f4c652c5`; //local
            const requestOptions = {
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            }
            fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    setTimeout(() => {
                        this.GameView.LoadingNode.active = false;
                        this.GameView.LoadingAnim.stop();
                    }, 2000);
                    throw new Error('Network response was not ok');
                }
                return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.GameView.IsActiveNode.active = !data?.data?.event?.isActive;
                    this.isCode = data?.data?.event?.isCodeRequired;
                    this.convertTime_UTC_H_D_M_Y(data?.data?.event?.startDate, 
                        this.GameView.StartTimeWheelLabel, 'Thời gian bắt đầu:');
                    this.convertTime_UTC_H_D_M_Y(data?.data?.event?.endDate, 
                        this.GameView.EndTimeWheelLabel, 'Thời gian kết thúc:');
                    this.checkTypeHistoryReward(data?.data?.event?.isRewardHistoryShown);
                    this.instantiateLuckyWheelItems(data);
                    this.checkTypeCode()
                    this.GameView.FrameDarkFull.active = false;
                })
                .catch(error => {
                    console.log('e:' , error);
                    this.GameView.FrameDarkFull.active = false;
                }) 
        } catch (error) {
            console.log(error);
            this.GameView.FrameDarkFull.active = false;
        }
    }

    private async callAPIToSpin(isCode: boolean, phoneNumber: string, userName: string, codeString: string): Promise<void> {
        try {
            const url =  new URL(location.href);
            const eventId = url.searchParams.get("eventId");
            // if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/spin`; //dev
            let body: object;
            if (isCode) {
                body = {
                    'phone': `${phoneNumber}`,
                    'name': `${userName}`,
                    'eventId': `${eventId}`,
                    'spinCode': `${codeString}`
                }
            } else {
                body = {
                    'phone': `${phoneNumber}`,
                    'name': `${userName}`,
                    'eventId': `${eventId}`,
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
                    this.GameView.LoadingNode.active = false;
                    this.GameView.LoadingAnim.stop();
                    alert('Thong tin khong hop le');
                    this.GameView.PopupEnterInfoUserNode.active = true;
                    this.GameView.PopupEnterInfoUserTableNode.position =  new Vec3(0, 780);
            this.GameModel.EditBoxCode.string = this.GameModel.EditBoxName.string
            = this.GameModel.EditBoxPhoneNumber.string = "";
            let newTween2 = tween(this.GameView.PopupEnterInfoUserTableNode)
                            .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
                            .start();
                    throw new Error('Network response was not ok');
                }
                return response.json();
                })
                .then(data => {
                    console.log(data)
                    this.GameView.PopupEnterInfoUserNode.active = false;
                    this.setDataLocalStorage();
                    this.activeInforUserOutside();
                    this.GameView.LoadingNode.active = false;
                    this.GameView.LoadingAnim.stop();
                    this.startSpin(data);
                })
                .catch(error => {
                    console.log('e:' , error);
                }) 
        } catch (error) {
            console.log(error)
        }
    }

    private async callAPIToCheckEventHistoryReward(): Promise<void> {
        try {
            const url =  new URL(location.href);
            const eventId = url.searchParams.get("eventId");
            if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/history-award/${eventId}`; //dev
            // let apiUrl = `${env.API_URL_DEV}/lucky-wheel/event/680a0e60dfdd7a18f4c652c5`; //local
            const requestOptions = {
                method: "GET",
                headers: {
                    "accept": "application/json"
                }
            }
            fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.instantiateHistoryRewardEvent(data);
                })
                .catch(error => {
                    console.log('e:' , error);
                    this.GameView.FrameDarkFull.active = false;
                }) 
        } catch (error) {
            console.log(error);
            this.GameView.FrameDarkFull.active = false;
        }
    }

    private activeInforUserOutside(): void {
        this.GameView.InformationUserOutside.active = true;
        this.GameView.LabelUserName.string = `Tên: ${this.userName}`;
        this.GameView.LabelUserPhoneNumber.string = `SĐT: ${this.phoneNumber}`;
        this.GameView.LabelUserCode.string = `Code: ${this.codeString}`;
    }

    private setDataLocalStorage(): void {
        if (this.userName != "" && this.phoneNumber != "" && this.codeString != "") {
            sys.localStorage.setItem('userDataName', this.userName);
            sys.localStorage.setItem('userDataPhoneNumber', this.phoneNumber);
            sys.localStorage.setItem('codeString', this.codeString);
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

    private async onClickConfirmUserInfo(): Promise<void> {
        try {
            if (this.phoneNumber != "" && this.userName != "" && this.phoneNumber != null && this.userName != null) {
                this.GameView.LoadingNode.active = true;
                this.GameView.LoadingAnim.play();
                await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, this.codeString);
                // await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, '68060630b34b3de021c569ea');//local
                
            } 
        } catch (error) {
            alert('Hay nhap day du thong tin');
        }
    }

    private getAllIndexes(arr: any, val: any): number[] {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) != -1){
            indexes.push(i);
        }
        return indexes;
    }

    private displayDefaultUI(): void {
        this.GameView.HistoryRewardNode.active = this.GameView.LuckyWheelNode.active = this.GameView.InformationUserOutside.active = false;
    }

    // Convert time to string
    public convertTime_UTC_H_D_M_Y(time: number, timeLabel: Label, stringLabel: string): void {
        const timeConvert = new Date(time);
        let date = timeConvert.getDate();
        let month = timeConvert.getMonth() + 1;
        let hours = timeConvert.getHours();
        let minutes = timeConvert.getMinutes();
        const formattedHours: string = hours < 10 ? '0' + hours : hours.toString();
        const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();
        const formattedDate: string = date < 10 ? '0' + date : date.toString();
        const formattedMonth: string = month < 10 ? '0' + month : month.toString();

        const formattedTime = `${formattedHours}h${formattedMinutes} - ${formattedDate}/${formattedMonth}/${timeConvert.getFullYear()}`;
        timeLabel.string = `${stringLabel} ${formattedTime}`;
    }
}


