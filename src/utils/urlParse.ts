export default {
    getUrlKey: function (name: string) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ["", ""])[1].replace(/\+/g, '%20'));
    }
}
