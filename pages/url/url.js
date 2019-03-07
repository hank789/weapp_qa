
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl: '',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      linkUrl: decodeURIComponent(options.url),
      name: options.name
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    request.httpsPostRequest('/weapp/product/feedback', { title: '分享链接', content: this.data.name }, function (res_data) { });
    return {
      title: this.data.name,
      path: "/pages/url/url?url=" + encodeURIComponent(this.data.linkUrl)  + '&name=' + this.data.name
    }
  }
})