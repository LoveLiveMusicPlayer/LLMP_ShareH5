const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default {
    jumpToDownload: async (isAndroid: boolean, millisecond?: number) => {
        await delay(millisecond ?? 0)
        return isAndroid ? 'https://hey.scandown.com/qp49' : 'itms-apps://itunes.apple.com/app/1641625393'
    }
}
