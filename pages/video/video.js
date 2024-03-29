// pages/video/video.js
import util from '../../utils/util.js'
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  /**
   * 页面的初始数据
   */
  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '分享视频'
	  },
    videoLink: '',
    videoType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageOptions.loaded(this)

    console.log(options, '视频数据')
    var that = this
    var videoLink = decodeURIComponent(options.url)
    var parseUrl = util.parseUrl(videoLink)
    if (parseUrl.host === 'v.qq.com') {
      var vid = parseUrl.pathname.replace('/x/page/','')
      vid = vid.replace('.html','')
      this.setData({
        videoLink: vid,
        videoType: 2,
	      autoShareParams: {
		      title: that.data.queryObject.name
	      },
      })
    } else {
      this.setData({
        videoLink: videoLink,
        videoType: 1,
	      autoShareParams: {
		      title: that.data.queryObject.name
	      },
      })
    }
  },

  // 关闭事件触发
  bind_close_video() {
    this.fullChange(false);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

}))