export default {
    millisecondToTime: function (millisecond: number) {
        let result = '';
        const minutes = Math.floor((millisecond % 3600000) / 60000);
        result += minutes < 10 ? `0${minutes}` : minutes;
        result += ':';
        const seconds = Math.floor((millisecond % 60000) / 1000);
        result += seconds < 10 ? `0${seconds}` : seconds;
        return result;
    },

    musicControlLeftMargin: function (millisecond: number, total: number) {
        const ratio = millisecond / total;
        const margin = ratio * 83;
        return `${margin}vw`;
    },
};
