var statistics = require('./statistics.js');
var util = require('./util.js');

var getOptions = (options) => {
  var startTime,
    endTime,
    app = getApp();

  // 重写onLoad
  var oldOnLoad = function () {}
  if (options.onLoad) {
    oldOnLoad = options.onLoad
  }
  options.onLoad = function (queryObject) {
    var scene = decodeURIComponent(queryObject.scene)
    if (scene !== 'undefined') {
      queryObject.id = scene.split("=")[1];
    }

    // 自动解码加密的字符串
    if (queryObject.url) {
      queryObject.url = decodeURIComponent(queryObject.url)
    }

    this.setData({
      queryObject: queryObject,
      loading: 1
    })

    wx.showLoading({
      title: '加载中',
    })

    oldOnLoad.call(this, queryObject)
  }

  // 重写onShow
  var oldOnShow = function () {}
  if (options.onShow) {
    oldOnShow = options.onShow
  }
  options.onShow = function () {
    oldOnShow.call(this)
    console.log("页面被切换显示")
    startTime = +new Date();
  }

  // 重写onHide
  var oldOnHide = function () {}
  if (options.oldHide) {
    oldOnHide = options.oldHide
  }
  options.onHide = function () {
    console.log('onHide fired')
    oldOnHide.call(this)

    endTime = +new Date();
    console.log("startTime时间：" + startTime)
    console.log("页面停留时间：" + (endTime - startTime))

    // 上报数据
    statistics.uploadData(
      startTime,
      endTime,
      this.route,
      this.data.queryObject,
      () => {
        startTime = 0
      }
    )
  }

  // 重写onUnload
  var oldOnUnload = function () { }
  if (options.onUnload) {
    oldOnUnload = options.onUnload
  }
  options.onUnload = function () {
    oldOnUnload.call(this)

    endTime = +new Date();

    if (!startTime) {
      return
    }

    console.log("startTime时间：" + startTime)
    console.log("页面停留时间：" + (endTime - startTime))
    // 上报数据
    statistics.uploadData(startTime, endTime, this.route, this.data.queryObject)
  }

  // 重写onShareAppMessage
  if (options.data.autoShareCurPage) {
    if (!options.data.autoShareParams) {
      console.error('autoShareParams not found')
    } else {
      if (!options.data.autoShareParams.title) {
        console.error('autoShareParams.title not found')
      }
    }

    options.onShareAppMessage = function () {
      let app = getApp();
      console.log('globalData', app.globalData)
      let params = {}
      if (app.globalData.userInfo.oauth_id) {
        params = Object.assign(this.data.queryObject, {
          from_oauth_id: app.globalData.userInfo.oauth_id
        })
      } else {
        params = this.data.queryObject
      }
      var queryStr = util.http_build_query(params)
      queryStr = queryStr ? '?' + queryStr : ''
      var autoShareTitle = this.data.autoShareParams.title
      var autoSharePath = "/" + this.route + queryStr

      console.log('autoShareTitle:' + autoShareTitle)
      console.log('autoSharePath:' + autoSharePath)

      statistics.uploadShareData(autoShareTitle, autoSharePath)

      var shareParams = {
        title: autoShareTitle,
        path: autoSharePath
      }

      if (this.data.autoShareParams.imageUrl) {
        shareParams.imageUrl = this.data.autoShareParams.imageUrl
      }

      return shareParams
    }
  }
  return options
}

var loaded = function (obj) {
  obj.setData({
    loading: 0
  })
  setTimeout(function () {
    wx.hideLoading()
  }, 200)
}

var loading = function (obj) {
  obj.setData({
    loading: 1
  })

  wx.showLoading({
    title: '加载中',
  })
}

module.exports = {
  getOptions: getOptions,
  loaded: loaded,
  loading: loading
}
