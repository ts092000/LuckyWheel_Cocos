import { _decorator, assetManager, CCFloat, CCString, Color, Component, EditBox, error, ImageAsset, instantiate, Label, math, misc, Node, randomRange, randomRangeInt, Size, Sprite, SpriteFrame, sys, Texture2D, tween, Tween, UITransform, Vec2, Vec3, AudioClip } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { GameAPI } from './GameAPI';
import { ItemReward } from './ItemRewardPrefab/ItemReward';
import { ItemWheel } from './ItemRewardPrefab/ItemWheel';
import { AudioController } from './AudioController';
import env from './env-config';
import { ItemHistory } from './ItemRewardPrefab/ItemHistory';
import { PlatformChecker } from './PlatformChecker';
import { Dayjs } from 'dayjs'
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(GameModel)
    private GameModel: GameModel;

    @property(GameView)
    private GameView: GameView;

    @property(GameAPI)
    private GameAPI: GameAPI;

    @property(PlatformChecker)
    private PlatformChecker: PlatformChecker;

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
    private listAwardName: string[] = [];
    private listImgUrl: string[] = [];

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

    private data: any;
    private isDesktop: boolean = true;
    private eventId: string;
    private newArr: number[] = [];
    private intervalNew: any = null;
    private isViewOnly: boolean = false;

    private sumOfItem: number = 0;

    protected onLoad(): void {
        const url =  new URL(location.href);
        const viewOnly = url.searchParams.get("viewOnly");
        this.eventId = url.searchParams.get("eventId");
        this.checkPlatform();
        this.callAPIToCheckEventData();
        this.GameView.InformationRemainingCountOutside.active = false;
        this.GameView.FrameDarkFull.active = true;
        this.GameView.PopupEnterInfoUserNode.active = false;
        this.GameView.InformationUserOutside.active = false;
        if (viewOnly === 'true') {
            this.isViewOnly = true;
        } else {
            this.isViewOnly = false;
            // this.loadImageSprite(this.imageUrl);
            this.checkLocalStorageUser();
            
            this.callAPIToCheckEventHistoryReward();
            // this.instantiateLuckyWheelItems();
            
            this.GameModel.EditBoxName.node.on('editing-did-began', this.editBeganName, this);
            this.GameModel.EditBoxName.node.on('text-changed', this.textChanged, this);
            this.GameModel.EditBoxName.node.on('editing-did-ended', this.editEnded, this);
            // this.callAPIToCheckEventData();
            // this.handleImageDownload(this.imageUrl, this.GameView.BgSprite);
            // this.handleDownload(this.imageUrl);
            // this.GetSpriteFromUrl(this.imageUrl)
            
            clearInterval(this.intervalNew);
            this.intervalNew = setInterval(() => {
                this.callAPIToCheckEventHistoryReward();
                
            }, 30000);
        }
        // Hide the actual system cursor (might not work on all platforms/browsers)
        document.body.style.cursor = 'default';

        // this.GameModel.BtnSpin.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.GameModel.BtnSpin.node.on(Node.EventType.MOUSE_MOVE, this.onMouseEnter, this);
        this.GameModel.BtnSpin.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        // this.GameModel.BtnEditInfoUser.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.GameModel.BtnEditInfoUser.node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.GameModel.BtnEditInfoUser.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    protected start(): void {

    }

    protected update(dt: number): void {
        // this.GameModel.SpinNode.angle -= this.speed;
    }

    protected onDestroy (): void {
        // this.GameModel.BtnSpin.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.GameModel.BtnSpin.node.off(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.GameModel.BtnSpin.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        // this.GameModel.BtnEditInfoUser.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.GameModel.BtnEditInfoUser.node.off(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.GameModel.BtnEditInfoUser.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        document.body.style.cursor = 'default'; // Restore default cursor
    }

    private onMouseEnter (event: Event) {
        document.body.style.cursor = 'pointer';
    }

    private onMouseMove (event: Event) {
        document.body.style.cursor = 'pointer';
    }

    private onMouseLeave (event: Event) {
        document.body.style.cursor = 'default';
    }

    private checkPlatform(): void {
        console.log("Current Platform:", PlatformChecker.getPlatform());

        if (PlatformChecker.isNative()) {
            console.log("Running on a native platform.");
            this.checkIsMobileOrPc();
        } else if (PlatformChecker.isBrowser()) {
            console.log("Running in a browser.");
            this.checkIsMobileOrPc();
        }
    }

    private checkIsMobileOrPc(): void {
        if (PlatformChecker.isMobile()) {
            this.GameView.BgSprite.spriteFrame = this.GameView.BgSf[1];
            this.isDesktop = false;
            console.log('mobile');
            this.GameView.LuckyWheelNode.setScale(new Vec3(2.5, 2.5, this.GameView.LuckyWheelNode.scale.z));
            this.GameView.PopupEnterInfoUserTableNode.setScale(new Vec3(2.2, 2.2, this.GameView.LuckyWheelNode.scale.z));
            this.GameView.LuckyWheelNode.setPosition(new Vec3(0, -20));
            console.log("Running on a mobile native platform.");
            if (PlatformChecker.isIOS()) {
                console.log("Running on iOS.");
            } else if (PlatformChecker.isAndroid()) {
                console.log("Running on Android.");
            }
        } else if (PlatformChecker.isDesktop()) {
            console.log('desktop');

            this.GameView.BgSprite.spriteFrame = this.GameView.BgSf[0];
            this.isDesktop = true;
            console.log("Running on a desktop native platform.");
            if (PlatformChecker.isWindows()) {
                console.log("Running on Windows.");
            } else if (PlatformChecker.isOSX()) {
                console.log("Running on macOS.");
            }
        }
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

    private PopupNoti(event: Event, customEventData: string): void {
        if (customEventData === '0') {
            this.GameView.PopupNotiNode.active = false;
        }
        else this.GameView.PopupNotiNode.active = true;
    }
    //-------

    //Check information user
    private async checkInformationUser(): Promise<void> {
        if (this.isViewOnly) {
            this.startSpin2();
        } else {

            if (this.isCode) {
                if (!this.userName && !this.phoneNumber && !this.codeString) {
                    this.GameView.PopupEnterInfoUserNode.active = true;
                    this.GameView.PopupEnterInfoUserTableNode.position =  new Vec3(0, 800);
                    this.GameModel.EditBoxCode.string = this.GameModel.EditBoxName.string
                    = this.GameModel.EditBoxPhoneNumber.string = "";
                    let newTween2 = tween(this.GameView.PopupEnterInfoUserTableNode)
                                    .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
                                    .start();
        
                }    
                else { 
                    this.GameView.PopupEnterInfoUserNode.active = false;
                    this.GameView.LoadingNode.active = true;
                    this.GameView.LoadingAnim.play();
                    this.userName = sys.localStorage.getItem(`userDataName_${this.eventId}`);
                    this.phoneNumber = sys.localStorage.getItem(`userDataPhoneNumber_${this.eventId}`);
                    this.codeString = sys.localStorage.getItem(`codeString_${this.eventId}`);
                    await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, this.codeString);
                    // await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, '68060630b34b3de021c569ea');//local
                }
            }
            else {
                if (!this.userName && !this.phoneNumber) {
                    this.GameView.PopupEnterInfoUserNode.active = true;
                    this.GameView.PopupEnterInfoUserTableNode.position =  new Vec3(0, 800);
                    this.GameModel.EditBoxCode.string = this.GameModel.EditBoxName.string
                    = this.GameModel.EditBoxPhoneNumber.string = "";
                    let newTween2 = tween(this.GameView.PopupEnterInfoUserTableNode)
                                    .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
                                    .start();
        
                }    
                else { 
                    this.GameView.PopupEnterInfoUserNode.active = false;
                    this.GameView.LoadingNode.active = true;
                    this.GameView.LoadingAnim.play();
                    this.userName = sys.localStorage.getItem(`userDataName_${this.eventId}`);
                    this.phoneNumber = sys.localStorage.getItem(`userDataPhoneNumber_${this.eventId}`);
                    this.codeString = sys.localStorage.getItem(`codeString_${this.eventId}`);
                    await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, this.codeString);
                    // await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, '68060630b34b3de021c569ea');//local
                }
            }
        }
    }
    


    // Do Animation Spin
    private startSpin2(): void {
        // console.log('start spin')
        if (this.isSpinning) {
            return;
        }
        this.isSpinning = true;
        this.GameModel.BtnEditInfoUser.interactable = false;
        this.GameModel.BtnSpin.interactable = false;
        const winningIndex = randomRangeInt(0, this.idList.length);
        // const targetRotationZ = - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement + degreesPerElement / 2)) * this.turnInSection;
        let targetRotationZ = (- (360 * this.finalSpinRotations + this.degreeTarget2[winningIndex]) - 1080 * this.turnInSection) 
        + randomRangeInt(-this.degreeTarget[winningIndex] + 0.5, this.degreeTarget[winningIndex] - 0.5);
        setTimeout(() => {
            this.AudioController.playSoundGame(this.AudioController.soundGameList[0]);
            // if (data?.data?.quantitySpinRemaining > 0) {
            //     this.GameView.InformationRemainingCountOutside.active = true;
            //     this.GameView.InformationRemainingCountLabelOutside.string = `Bạn còn ${data?.data?.quantitySpinRemaining} lượt quay`;
            // } else {
            //     this.GameView.InformationRemainingCountOutside.active = false;
            // }
        }, 1500);
        // Final spin
        let spinTween2 = tween(this.GameModel.SpinNode)
            .to(this.finalSpinDuration, { eulerAngles: new Vec3(0, 0, targetRotationZ) }, { easing: "cubicInOut" })
            .call(() => {
                this.isSpinning = false;
                this.GameView.RewardTable.setScale(new Vec3(0, 0, 1));
                this.turnInSection += 3;
                // console.log('winId: ', winningIndex);
                this.GameView.PopupShowRewardNode.active = true;
                let newTween = tween(this.GameView.RewardTable).to(0.5, {scale: new Vec3(1.2, 1.2, 1)}).start();
                // if (!data?.data?.isAwardAvailable) {
                //     this.displayUIPopupReward(2, false, `Phần thưởng ${} đã hết`);
                // } else {
                // }
                this.displayUIPopupReward(1, true, `Chúc mừng bạn đã trúng thưởng`);
                
                this.GameView.RewardInPopupSpriteLabel.string = `${this.listAwardName[winningIndex]}`;
                Color.fromHEX(this.GameView.LabelCongrats.color, this.data?.data?.event?.setting?.winTextColor);
                Color.fromHEX(this.GameView.RewardInPopupSpriteLabel.color, this.data?.data?.event?.setting?.winTextColor);
                Color.fromHEX(this.GameView.LabelOutlineCongrats.color, this.data?.data?.event?.setting?.winTextBorderColor);
                Color.fromHEX(this.GameView.RewardInPopupSpriteLabelOutline.color, this.data?.data?.event?.setting?.winTextBorderColor);
                // this.loadImageSprite(data?.data?.award?.imgUrl, this.GameView.RewardInPopupSprite);
                setTimeout(() => {
                    // this.callAPIToCheckEventHistoryReward();
                    this.GameModel.BtnEditInfoUser.interactable = false;
                    this.GameModel.BtnClosePopup.interactable = true;
                    this.GameModel.BtnClosePopup2.interactable = true;
                    this.GameModel.BtnSpin.interactable = true;
                }, 510);
            })
            .start();
    }

    private startSpin(data: any): void {
        // console.log('start spin')
        if (this.isSpinning) {
            return;
        }
        // console.log('start spin 2')
        this.isSpinning = true;
        this.GameModel.BtnSpin.interactable = false;
        const winningIndex = this.idList.indexOf(data?.data?.award?._id);
        // console.log(winningIndex)
        // console.log(this.idList)
        // const targetRotationZ = - (360 * this.finalSpinRotations + (winningIndex * degreesPerElement + degreesPerElement / 2)) * this.turnInSection;
        let targetRotationZ = (- (360 * this.finalSpinRotations + this.degreeTarget2[winningIndex]) - 1080 * this.turnInSection) 
        + randomRangeInt(-this.degreeTarget[winningIndex] + 0.5, this.degreeTarget[winningIndex] - 0.5);
        setTimeout(() => {
            this.AudioController.playSoundGame(this.AudioController.soundGameList[0]);
            if (data?.data?.quantitySpinRemaining > 0) {
                this.GameView.InformationRemainingCountOutside.active = true;
                this.GameView.InformationRemainingCountLabelOutside.string = `Bạn còn ${data?.data?.quantitySpinRemaining} lượt quay`;
            } else {
                this.GameView.InformationRemainingCountOutside.active = false;
            }
        }, 1500);
        // Final spin
        let spinTween2 = tween(this.GameModel.SpinNode)
            .to(this.finalSpinDuration, { eulerAngles: new Vec3(0, 0, targetRotationZ) }, { easing: "cubicInOut" })
            .call(() => {
                this.isSpinning = false;
                this.GameView.RewardTable.setScale(new Vec3(0, 0, 1));
                this.turnInSection += 3;
                // console.log('winId: ', winningIndex);
                this.GameView.PopupShowRewardNode.active = true;
                let newTween = tween(this.GameView.RewardTable).to(0.5, {scale: new Vec3(1.2, 1.2, 1)}).start();
                if (!data?.data?.isAwardAvailable) {
                    this.displayUIPopupReward(2, false, `Phần thưởng ${data?.data?.award?.name} đã hết`);
                } else {
                    this.displayUIPopupReward(1, true, `Chúc mừng bạn đã trúng thưởng`);
                }
                
                this.GameView.RewardInPopupSpriteLabel.string = `${data?.data?.award?.name}`;
                Color.fromHEX(this.GameView.LabelCongrats.color, this.data?.data?.event?.setting?.winTextColor);
                Color.fromHEX(this.GameView.RewardInPopupSpriteLabel.color, this.data?.data?.event?.setting?.winTextColor);
                Color.fromHEX(this.GameView.LabelOutlineCongrats.color, this.data?.data?.event?.setting?.winTextBorderColor);
                Color.fromHEX(this.GameView.RewardInPopupSpriteLabelOutline.color, this.data?.data?.event?.setting?.winTextBorderColor);
                this.loadImageSprite(data?.data?.award?.imgUrl, this.GameView.RewardInPopupSprite);
                setTimeout(() => {
                    this.callAPIToCheckEventHistoryReward();
                    this.GameModel.BtnEditInfoUser.interactable = true;
                    this.GameModel.BtnClosePopup.interactable = true;
                    this.GameModel.BtnClosePopup2.interactable = true;
                    this.GameModel.BtnSpin.interactable = true;
                }, 510);
            })
            .start();
    }

    private displayUIPopupReward(index: number, nameLabelNode: boolean, text: string): void {
        this.AudioController.playSoundGame(this.AudioController.soundGameList[index]);
        this.GameView.RewardInPopupSpriteLabel.node.active = nameLabelNode;
        this.GameView.LabelCongrats.string = text;
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
        this.listImgUrl = [];
        let listBgColor = [];
        let listColorText = [];
        let ratioList = [];
        let currentAngle = 0;
        for (let i = 0; i < this.numberOfItems; i++) {
            for (let j = 0; j < data?.data?.awards[i]?.viewCount; j++) {
                this.idList.push(data?.data?.awards[i]?._id)
                const ratio = data?.data?.awards[i]?.viewRate / data?.data?.awards[i]?.viewCount;
                // console.log(ratio)
                const angleIncrement = 360 * ratio;
                if (this.GameModel.ItemWheelContainer) {
                    this.degreeTarget.push(angleIncrement/2);
                    currentAngle += angleIncrement;
                    // this.degreeTarget2.push(currentAngle - angleIncrement/2);
                    this.listAwardName.push(data?.data?.awards[i]?.name);
                    this.listImgUrl.push(data?.data?.awards[i]?.imgUrl)
                    listBgColor.push(data?.data?.awards[i]?.colorText);
                    listColorText.push(data?.data?.awards[i]?.background);
                    ratioList.push(ratio);
                }
            }
        }

        this.idList = this.reorderByIndexArray(this.newArr, this.idList);
        this.degreeTarget = this.reorderByIndexArray(this.newArr, this.degreeTarget);
        
        this.listAwardName = this.reorderByIndexArray(this.newArr, this.listAwardName);
        ratioList = this.reorderByIndexArray(this.newArr, ratioList);
        this.listImgUrl = this.reorderByIndexArray(this.newArr, this.listImgUrl);
        listBgColor = this.reorderByIndexArray(this.newArr, listBgColor);
        listColorText = this.reorderByIndexArray(this.newArr, listColorText);

        currentAngle = 0;
        for (let i = 0; i < this.sumOfItem; i++) {
            // this.idList.push(data?.data?.awards[i]?._id)
            const ratio = ratioList[i];
            // console.log(ratio)
            const angleIncrement = 360 * ratio;
            const sliceCenterAngle = currentAngle + angleIncrement;
            const sliceCenterAngle2 = currentAngle + angleIncrement - angleIncrement / 2;
            const angleRad = sliceCenterAngle * Math.PI / 180;
            const angleRad2 = sliceCenterAngle2 * Math.PI / 180;
            let viewSizeAwardSprite: number;
            if (ratio > 0.1) viewSizeAwardSprite = 1 * ratio * 3;
            else viewSizeAwardSprite = 1 * ratio * 8;
            const viewSizeAwardSprite2 = 1 * ratio * 1.5;
            const newItem = instantiate(this.GameModel.ItemWheelPrefab2);
            if (this.GameModel.ItemWheelContainer) {
                let newItemComponent = newItem.getComponent(ItemWheel);
                newItem.parent = this.GameModel.ItemWheelContainer;
                newItemComponent.spriteItemReward.node.setScale(new Vec3(viewSizeAwardSprite2, viewSizeAwardSprite2, 1));
                newItemComponent.richTextItemWheel.node.setScale(new Vec3(viewSizeAwardSprite, viewSizeAwardSprite, 1));
                newItemComponent.richTextItemWheel.string = `<color=${listColorText[i]}><outline color=${listBgColor[i]} width=2.5>${this.listAwardName[i]}</outline></color>`;
                this.loadImageSprite(this.listImgUrl[i], newItemComponent.spriteItemReward);
                Color.fromHEX(newItemComponent.labelItemWheel.color, `${listColorText[i]}`);
                Color.fromHEX(newItemComponent.spriteItemWheel.color, `${listBgColor[i]}`);

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
                // this.degreeTarget.push(angleIncrement/2);
                currentAngle += angleIncrement;
                this.degreeTarget2.push(currentAngle - angleIncrement/2);
                // this.listAwardName.push(data?.data?.awards[i]?.name);
                
            }
        }

        currentAngle = 0;
        for (let i = 0; i < this.sumOfItem; i++) {
            // this.idList.push(data?.data?.awards[i]?._id)
            const ratio = ratioList[i];
            // console.log(ratio)
            const angleIncrement = 360 * ratio;
            const sliceCenterAngle = currentAngle + angleIncrement;
            const sliceCenterAngle2 = currentAngle + angleIncrement - angleIncrement / 2;
            const angleRad = sliceCenterAngle * Math.PI / 180;
            const angleRad2 = sliceCenterAngle2 * Math.PI / 180;
            const newItem = instantiate(this.GameModel.ItemLineNodeLuckyWheel);
            if (this.GameModel.ItemWheelContainer) {
                let newItemComponent = newItem.getComponent(ItemWheel);
                newItem.parent = this.GameModel.ItemWheelContainer;
                newItemComponent.lineGraphics.lineWidth = 2; // Set the line width
                // newItemComponent.lineGraphics.lineCap = 5; // Set the line width
                newItemComponent.lineGraphics.strokeColor = Color.BLACK; // Set the line color to black
                newItemComponent.lineGraphics.moveTo(-120, 0); // Move the starting point of the line
                newItemComponent.lineGraphics.lineTo(130, 0); // Draw a line to (100, 0) - adjust these coordinates as needed
                newItemComponent.lineGraphics.stroke(); // Draw the line
                // Tính toán vị trí trên đường tròn (tâm của phần tử)
                const labelRadius2 = this.wheelRadius * 1; // Đặt label gần tâm hơn một chút
                const x3 = labelRadius2 * Math.sin(angleRad);
                const y3 = labelRadius2 * Math.cos(angleRad);
                newItemComponent.lineNode.setPosition(new Vec3(-x3, y3, 0));

                // Xoay label để nó vuông góc với tâm
                newItemComponent.lineNode.eulerAngles = new Vec3(0, 0, sliceCenterAngle + 90);

                // Lưu trữ góc bắt đầu và kết thúc của phần tử (có thể dùng cho việc xác định phần trúng thưởng)
                newItem['startAngle'] = currentAngle;
                newItem['endAngle'] = currentAngle + angleIncrement;
                // this.degreeTarget.push(angleIncrement/2);
                currentAngle += angleIncrement;
                // this.listAwardName.push(data?.data?.awards[i]?.name);
                
            }
        }
        // this.degreeTarget2 = this.reorderByIndexArray(this.newArr, this.degreeTarget2);
        // console.log('listdegree 2', this.degreeTarget2)
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
        if (this.isDesktop) {
            if (isHistoryActive) this.GameView.LuckyWheelNode.position = new Vec3(550, -90, this.GameView.LuckyWheelNode.position.z)
            else this.GameView.LuckyWheelNode.position = new Vec3(50, -90, this.GameView.LuckyWheelNode.position.z)
        } else {
            console.log('detect mobile');
        }
    }

    private checkTypeCode(): void {
        this.GameView.InformationUserCodeOutside.active = this.isCode;
        this.GameModel.CodeNodeInPopupEnterUser.active = this.isCode;
    }

    private async checkLocalStorageUser(): Promise<void> {
        this.userName = sys.localStorage.getItem(`userDataName_${this.eventId}`);
        this.phoneNumber = sys.localStorage.getItem(`userDataPhoneNumber_${this.eventId}`);
        this.codeString = sys.localStorage.getItem(`codeString_${this.eventId}`);
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
            }
        }
    }
    private modifyRandomIndex(n: number): number[] {
        // Create array from 0 to n
        const arr: number[] = Array.from({ length: n + 1 }, (_, i) => i);
    
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * (n + 1));
    
        // // Modify the value at the random index
        // arr[randomIndex] = -1;
        // console.log(`Modified index: ${randomIndex}`);
        for (let i = arr.length - 1; i > 0; i--) {
            // Chọn một chỉ số ngẫu nhiên từ 0 đến i
            const randomIndex = Math.floor(Math.random() * (i + 1));
    
            // Hoán đổi phần tử ở chỉ số i với phần tử ở chỉ số ngẫu nhiên
            [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
        }

        return arr;
    }

    private async callAPIToCheckEventData(): Promise<void> {
        try {
            const url =  new URL(location.href);
            
            if(!this.eventId) 
            { 
                // alert('Su kien khong ton tai');
                this.displayDefaultUI('Su kien khong ton tai');
            }
            
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/event/${this.eventId}`; //dev
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
                    // setTimeout(() => {
                    //     this.GameView.LoadingNode.active = false;
                    //     this.GameView.LoadingAnim.stop();
                    // }, 2000);
                    if (response.status === 500) this.displayDefaultUI('Sự kiện không tồn tại!!!');
                    else {
                        response.json().then(res => {
                            this.displayDefaultUI(res?.message);
                        })
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
                })
                .then(data => {
                    // console.log(data);
                    this.data = data;
                    // this.sum(data);
                    this.sumOfItem = data?.data?.awards.reduce((sum, current) => sum + current.viewCount, 0);
                    this.newArr = this.modifyRandomIndex(this.sumOfItem - 1)
                    this.GameView.IsActiveNode.active = !data?.data?.event?.isActive;
                    this.isCode = data?.data?.event?.isCodeRequired;
                    this.convertTime_UTC_H_D_M_Y(data?.data?.event?.startDate, 
                        this.GameView.StartTimeWheelLabel, 'Thời gian bắt đầu:');
                    this.convertTime_UTC_H_D_M_Y(data?.data?.event?.endDate, 
                        this.GameView.EndTimeWheelLabel, 'Thời gian kết thúc:');
                    this.checkTypeHistoryReward(data?.data?.event?.isRewardHistoryShown);
                    this.instantiateLuckyWheelItems(data);
                    this.checkTypeCode()
                    if (this.isDesktop) this.loadImageSprite(data?.data?.event?.setting?.imgUrlDesk, this.GameView.BgSprite);
                    else this.loadImageSprite(data?.data?.event?.setting?.imgUrlMobi, this.GameView.BgSprite);
                    setTimeout(() => {
                        this.GameView.FrameDarkFull.active = false;
                    }, 500);
                })
                .catch(error => {
                    console.log('e:' , error);
                    
                    setTimeout(() => {
                        this.GameView.FrameDarkFull.active = false;
                    }, 500);
                })
        } catch (error) {
            console.log(error);
            this.displayDefaultUI('Su kien khong ton tai');
            setTimeout(() => {
                this.GameView.FrameDarkFull.active = false;
            }, 500);
        }
    }

    private async callAPIToSpin(isCode: boolean, phoneNumber: string, userName: string, codeString: string): Promise<void> {
        try {
            const url =  new URL(location.href);
            // const eventId = url.searchParams.get("eventId");
            // if(!eventId) alert('Su kien khong ton tai')
            
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/spin`; //dev
            let body: object;
            if (isCode) {
                body = {
                    'phone': `${phoneNumber}`,
                    'name': `${userName}`,
                    'eventId': `${this.eventId}`,
                    'spinCode': `${codeString}`
                }
            } else {
                body = {
                    'phone': `${phoneNumber}`,
                    'name': `${userName}`,
                    'eventId': `${this.eventId}`,
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
                    response.json().then(res => {
                        if (res.code === "NUMBER_OF_SPIN_HAS_EXPIRED" || res.code === "EVENT_ENDS" || res.code === "EVENT_NOT_YET_HAPPENED") {
                            this.openPopupNotiNode(`${res.message}`)
                        } else {
                        this.GameView.PopupEnterInfoUserNode.active = true;
                        this.GameView.PopupEnterInfoUserTableNode.position =  new Vec3(0, 800);
                        this.GameModel.EditBoxCode.string = this.GameModel.EditBoxName.string
                        = this.GameModel.EditBoxPhoneNumber.string = "";
                        let newTween2 = tween(this.GameView.PopupEnterInfoUserTableNode)
                                        .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
                                    .start();
                            if (!res.error) {
                                this.openPopupNotiNode(`${res.message}`)
                            }
                            else {
                                for (let i = 0; i < res?.error.length; i++) {
                                    this.openPopupNotiNode(`${res?.error[i]?.message}`);
                                }
                            }
                        }
                    })
                    throw new Error('Network response was not ok');
                }
                return response.json();
                })
                .then(data => {
                    // console.log(data)
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
            // const eventId = url.searchParams.get("eventId");
            // if(!eventId) alert('Su kien khong ton tai')
            let apiUrl = `${env.API_URL_DEV}/lucky-wheel/history-award/${this.eventId}`; //dev
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
                    // console.log(data);
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
            sys.localStorage.setItem(`userDataName_${this.eventId}`, this.userName);
            sys.localStorage.setItem(`userDataPhoneNumber_${this.eventId}`, this.phoneNumber);
            sys.localStorage.setItem(`codeString_${this.eventId}`, this.codeString);
        }
    }

    private editBeganName(editbox: EditBox, customEventData: string){
        // The callback parameter is the EditBox component, note that events registered this way cannot pass customEventData.
        // this.GameModel.LabelOutlineNamePlaceHolder.color = Color.BLACK;
        // console.log('123123')
        editbox.string = "";
        switch (customEventData) {
            case '1':
                this.GameModel.LabelNameInEditBox.color = Color.BLACK;
                break;
            case '2':
                this.GameModel.LabelPhoneNumberInEditBox.color = Color.BLACK;
                break;
            case '3':
                this.GameModel.LabelCodeInEditBox.color = Color.BLACK;
                break;
            default:
                break;
        // console.log(editbox)
        }
    }

    // private sum(obj: any): number {
    //     var sum = 0;
    //     for (var el in obj) {
    //         if(obj.hasOwnProperty(el) ) {
    //             sum += parseFloat(obj[el]);
    //         }
    //     }
    //     return sum;
    // }
      

    private textChanged(text: string, editbox: EditBox, customEventData: string){
        // The callback parameter is the EditBox component, note that events registered this way cannot pass customEventData.
        // this.GameModel.LabelOutlineNamePlaceHolder.color = Color.BLACK;
        // console.log('text changed');
        // console.log(text)
        // console.log(editbox);
        // switch (customEventData) {
        //     case '1':
        //         this.GameModel.LabelNameInEditBox.color = Color.BLACK;
        //         break;
        //     case '2':
        //         this.GameModel.LabelPhoneNumberInEditBox.color = Color.BLACK;
        //         break;
        //     case '3':
        //         this.GameModel.LabelCodeInEditBox.color = Color.BLACK;
        //         break;
        //     default:
        //         break;
        // }
    }

    private editEnded(editbox: EditBox, customEventData: string){
        // The callback parameter is the EditBox component, note that events registered this way cannot pass customEventData.
        // this.GameModel.LabelNamePlaceHolder.color = Color.WHITE;
        switch (customEventData) {
            case '1':
                this.GameModel.LabelNameInEditBox.color = Color.WHITE;
                if (editbox.string != "") this.userName = editbox.string;
                else this.userName = null;
                // console.log(this.userName);
                break;
            case '2':
                this.GameModel.LabelPhoneNumberInEditBox.color = Color.WHITE;
                if (editbox.string != "") this.phoneNumber = editbox.string;
                else this.phoneNumber = null;
                // console.log(this.phoneNumber);
                break;
            case '3':
                this.GameModel.LabelCodeInEditBox.color = Color.WHITE;
                if (editbox.string != "") this.codeString = editbox.string;
                // console.log(this.codeString);
                break;
            default:
                break;
        }
    }

    private openPopupNotiNode(text: string): void {
        this.GameView.TableNotiNode.setPosition(new Vec3(0, 1200, 0))
        this.GameView.PopupNotiNode.active = true;
        this.GameView.LabelInpopupNotiNode.string = text;
        let newTween = tween(this.GameView.TableNotiNode)
            .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
            .start();
    }

    private async onClickConfirmUserInfo(): Promise<void> {
        try {
            if (this.phoneNumber != "" && this.userName != "" && this.phoneNumber != null && this.userName != null) {
                this.GameView.LoadingNode.active = true;
                this.GameView.LoadingAnim.play();
                if (!this.isViewOnly) await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, this.codeString);
                // await this.callAPIToSpin(this.isCode, this.phoneNumber, this.userName, '68060630b34b3de021c569ea');//local
                
            } 
        } catch (error) {
            this.openPopupNotiNode('Hãy nhập đầy đủ thông tin');
        }
    }

    private getAllIndexes(arr: any, val: any): number[] {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) != -1){
            indexes.push(i);
        }
        return indexes;
    }

    private displayDefaultUI(message: string): void {
        this.GameView.HistoryRewardNode.active = this.GameView.LuckyWheelNode.active = this.GameView.InformationUserOutside.active = false;
        this.GameView.IsActiveNode.active = true;
        this.GameView.LabelInActiveNode.string = message;
    }

    // Convert time to string
    public convertTime_UTC_H_D_M_Y(time: any, timeLabel: Label, stringLabel: string): void {
        const timeConvert = new Date(time).toString();
        // let date = timeConvert.getDate();
        // let month = timeConvert.getMonth() + 1;
        // let hours = timeConvert.getHours();
        // let minutes = timeConvert.getMinutes();
        // const formattedHours: string = hours < 10 ? '0' + hours : hours.toString();
        // const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();
        // const formattedDate: string = date < 10 ? '0' + date : date.toString();
        // const formattedMonth: string = month < 10 ? '0' + month : month.toString();

        // console.log(timeConvert);
        // const formattedTime = `${formattedHours}h${formattedMinutes} - ${formattedDate}/${formattedMonth}/${timeConvert.getFullYear()}`;
        timeLabel.string = `${stringLabel} ${this.convertPDTtoUTC7(timeConvert)}`;
    }

    private convertPDTtoUTC7(pdtTimeString: string): string | null {
        try {
          // Create a Date object from the PDT time string
            const pdtDate = new Date(pdtTimeString);
        
            // Convert to UTC (this Date object will now represent the time in UTC)
            const utcDate = new Date(pdtDate.toISOString());
            
            // Apply the UTC+7 offset
            utcDate.setHours(utcDate.getHours() + 7);
            // Format the UTC+7 date and time as a string (you can customize the format)
            const utc7TimeString = utcDate.toISOString().replace('T', ' ').slice(0, 19) 
        //   + ' +07:00';
      
            return utc7TimeString;
        } catch (error) {
            console.error("Error converting PDT to UTC+7:", error);
            return null;
        }
    }

    private openPopupEnterUserInfo(): void {
        this.userName = sys.localStorage.getItem(`userDataName_${this.eventId}`);
        this.phoneNumber = sys.localStorage.getItem(`userDataPhoneNumber_${this.eventId}`);
        this.codeString = sys.localStorage.getItem(`codeString_${this.eventId}`);
        this.GameModel.LabelNameInEditBox.color = Color.WHITE;
        this.GameModel.LabelPhoneNumberInEditBox.color = Color.WHITE;
        this.GameModel.LabelCodeInEditBox.color = Color.WHITE;
        this.GameView.PopupEnterInfoUserNode.active = true;
        this.GameView.PopupEnterInfoUserTableNode.position =  new Vec3(0, 800);
        this.GameModel.EditBoxCode.string = `${this.codeString}`;
        this.GameModel.EditBoxName.string = `${this.userName}`;
        this.GameModel.EditBoxPhoneNumber.string = `${this.phoneNumber}`;
        let newTween2 = tween(this.GameView.PopupEnterInfoUserTableNode)
            .to(0.25, {position: new Vec3(0, 0)}, {easing: "fade"})
            .start();
    }

    private reorderByIndexArray<T>(indexArray: number[], valueArray: T[]): T[] {
        const newArray: T[] = new Array(indexArray.length);
        for (let i = 0; i < indexArray.length; i++) {
            const targetIndex = indexArray[i];
            newArray[targetIndex] = valueArray[i];
        }
        return newArray;
    }
}
