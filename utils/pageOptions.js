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
    setTimeout(function () {
      if (app.globalData.onShow) {
        app.globalData.onShow = 0;
        console.log("前后台切换之切到前台")
      }
      else {
        console.log("页面被切换显示")
        startTime = +new Date();
      }
    }, 100)
  }

  // 重写onHide
  var oldOnHide = function () {}
  if (options.oldHide) {
    oldOnHide = options.oldHide
  }
  options.onHide = function () {
    console.log('onHide fired')
    oldOnHide.call(this)
    var that = this
    setTimeout(function () {
      if (app.globalData.onHide) {
        app.globalData.onHide = 0;
        console.log("还在当前页面活动")
      }
      else {
        endTime = +new Date();
        console.log("页面停留时间：" + (endTime - startTime))
        console.log(that)
        // 上报数据
        statistics.uploadData(startTime, endTime, that.route, that.data.queryObject)
      }
    }, 100)
  }

  // 重写onUnload
  var oldOnUnload = function () { }
  if (options.onUnload) {
    oldOnUnload = options.onUnload
  }
  options.onUnload = function () {
    oldOnUnload.call(this)

    endTime = +new Date();
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
      var queryStr = util.http_build_query(this.data.queryObject)
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
