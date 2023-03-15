export const xrNasIP = 'http://10.87.1.106:2333/';

export function getZhushenwudiMusicUrlAPI(id: number[]): string {
    return `https://netease-backend.zhushenwudi.top/song/url/v1?id=${id}&level=lossless`;
}

export function getZhushenwudiMusicInfoAPI(id: number[]): string {
    return `https://netease-backend.zhushenwudi.top/song/detail?ids=${id}`;
}

export function getShareKV(): string {
    return 'https://fc-mp-92601a5b-3adb-44ca-b6f6-fc4e8b3edbca.next.bspapp.com/getShareKV'
}
