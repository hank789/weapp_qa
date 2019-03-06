

var request = require("./request.js");
var timeagoFun = require('./timeago.js');
var timeago = new timeagoFun()

function getDetail (id, successCallback) {
    request.httpsGetRequest('/weapp/product/albumInfo', {
        id: id
    }, function (res) {
        var code = res.code
        if (code !== 1000) {
            wx.showToast({
                title: res.message,
                icon: 'loading',
                duration: 2000
            })
        } else {
            successCallback(res.data)
        }
    })
}

function getProductList (id, page, successCallback) {
    request.httpsGetRequest('/weapp/product/albumProductList', {
        id: id,
        page: page
    }, function (res) {
        var code = res.code
        if (code !== 1000) {
            wx.showToast({
                title: res.message,
                icon: 'loading',
                duration: 2000
            })
        } else {
            successCallback(res)
        }
    })
}

function getSupports (id, successCallback) {
    request.httpsGetRequest('/weapp/product/getAlbumSupports', {
        id: id
    }, function (res) {
        var code = res.code
        if (code !== 1000) {
            wx.showToast({
                title: res.message,
                icon: 'loading',
                duration: 2000
            })
        } else {
            successCallback(res)
        }
    })
}

function getNewList (id, page, perPage, successCallback) {
    request.httpsPostRequest('/weapp/product/albumNewsList', {
        id: id,
        page: page,
        perPage: perPage
    }, function (response) {
        if (response.code !== 1000) {
            wx.showToast({
                title: response.message,
                icon: 'loading',
                duration: 2000
            });
        } else {
            successCallback(response)
        }
    })
}

function getComments (id, page, perPage, successCallback) {
    request.httpsPostRequest('/weapp/product/albumComments', {
        id: id,
        page: page,
        perPage: perPage
    }, function (response) {
        if (response.code !== 1000) {
            wx.showToast({
                title: response.message,
                icon: 'loading',
                duration: 2000
            });
        } else {
            response.data.data = replaceTimeago(response.data.data);
            successCallback(response)
        }
    })
}

function replaceTimeago (list) {
    for (var i = 0; i < list.length; i++) {
      list[i].timeago = timeago.format(list[i].created_at, 'zh_CN')

      if (list[i].children.length) {
        list[i].children = replaceTimeago(list[i].children)
      }
    }
    return list
}

function getReviewCommentList (slug, page, perPage, successCallback) {
  request.httpsGetRequest('/weapp/product/reviewCommentList', {
        submission_slug: slug,
        page: page,
        perPage: perPage
    }, function (response) {
        if (response.code !== 1000) {
            wx.showToast({
                title: response.message,
                icon: 'loading',
                duration: 2000
            });
        } else {
            successCallback(response)
        }
    })
}

function getMoreAlbum(id, successCallback) {
    request.httpsGetRequest('/weapp/product/moreAlbum', {
        id: id
    }, function (res) {
        var code = res.code
        if (code !== 1000) {
            wx.showToast({
                title: res.message,
                icon: 'loading',
                duration: 2000
            })
        } else {
            successCallback(res)
        }
    })
}


function getShareImage(id, type, successCallback, failCallback) {
    request.httpsGetRequest('/weapp/product/getAlbumShareImage', {id: id, type: type}, function (res) {
        console.log(res)
        if (res.code === 1000) {
            successCallback(res)
        } else {
            wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 2000
            });
            failCallback(res)
        }
    });
}

module.exports = {
    getDetail: getDetail,
    getProductList: getProductList,
    getSupports: getSupports,
    getNewList: getNewList,
    getComments: getComments,
    getReviewCommentList: getReviewCommentList,
    getShareImage: getShareImage,
    getMoreAlbum: getMoreAlbum
}
