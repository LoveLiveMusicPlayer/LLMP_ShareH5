const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    jumpToDownload: async (isAndroid: boolean, millisecond?: number) => {
        await delay(millisecond ?? 0)
        return isAndroid ? 'https://picbed-cdn.zhushenwudi.top/llmp-oss/LLMP-M/version/64bit/1.2.5.apk' : 'itms-apps://itunes.apple.com/app/1641625393'
    }
}
