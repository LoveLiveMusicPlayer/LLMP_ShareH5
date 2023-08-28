export const xrNasIP = 'http://10.87.1.106:2333/';

export function getZhushenwudiMusicUrlAPI(): string {
    return `https://netease-backend.zhushenwudi.top/song/url/v1?timestamp=${new Date().getTime()}`;
}

export function getZhushenwudiMusicInfoAPI(): string {
    return `https://netease-backend.zhushenwudi.top/song/detail?timestamp=${new Date().getTime()}`;
}

export function getShareKV(): string {
    return 'https://fc-mp-92601a5b-3adb-44ca-b6f6-fc4e8b3edbca.next.bspapp.com/getShareKV';
}
