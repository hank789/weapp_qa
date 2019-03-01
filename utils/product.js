var request = require("./request.js");

function getShareImage(id, type, successCallback, failCallback) {
    request.httpsGetRequest('/weapp/product/getProductShareImage', {id: id, type: type}, function (res_data) {
        if (res_data.code === 1000) {
            successCallback(res_data)
        } else {
            wx.showToast({
                title: res_data.message,
                icon: 'success',
                duration: 2000
            });
            failCallback(res_data)
        }
    });
}

function supportAlbumProduct (id, successCallback) {
    request.httpsPostRequest('/weapp/product/supportAlbumProduct', {
        id: id
    }, function (res) {
        successCallback(res)
    })
}

module.exports = {
    getShareImage: getShareImage,
    supportAlbumProduct: supportAlbumProduct
}
