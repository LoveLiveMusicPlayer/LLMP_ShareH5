export const xrNasIP = 'http://10.87.1.106:2333/';

export function getZhushenwudiMusicUrlAPI(id: number[]): string {
    return `https://netease-backend.zhushenwudi.top/song/url/v1?id=${id}&level=lossless`;
}

export function getZhushenwudiMusicInfoAPI(id: number[]): string {
    return `https://netease-backend.zhushenwudi.top/song/detail?ids=${id}`;
}
