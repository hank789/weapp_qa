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
    oldOnLoad.call(this, queryObject)
    this.setData({
      queryObject: queryObject
    })
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
        console.log("demo前后台切换之切到前台")
      }
      else {
        console.log("demo页面被切换显示")
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

      return {
        title: autoShareTitle,
        path: autoSharePath
      }
    }
  }
  return options
}

module.exports = {
  getOptions: getOptions,
}