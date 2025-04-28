import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlatformChecker')
export class PlatformChecker extends Component {
    public static getPlatform(): string {
        return sys.platform;
    }

    public static isNative(): boolean {
        return sys.isNative;
    }

    public static isBrowser(): boolean {
        return !sys.isNative;
    }

    public static isMobile(): boolean {
        return sys.isMobile;
    }

    public static isDesktop(): boolean {
        return sys.os === sys.OS.WINDOWS || sys.os === sys.OS.OSX;
    }

    public static isIOS(): boolean {
        return sys.os === sys.OS.IOS;
    }

    public static isAndroid(): boolean {
        return sys.os === sys.OS.ANDROID;
    }

    public static isWindows(): boolean {
        return sys.os === sys.OS.WINDOWS;
    }

    public static isOSX(): boolean {
        return sys.os === sys.OS.OSX;
    }
}

