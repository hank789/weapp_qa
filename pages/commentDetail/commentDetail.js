//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loding: 1,
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    request.httpsGetRequest('/weapp/product/reviewInfo', {
      slug: options.slug
    }, function (response) {
      var code = response.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.data.detail = response.data
      that.setData({
        detail: that.data.detail,
        loding: 0
      })
      console.log(that.data.detail ,':点评详情')
    })
  },
  goProductDetail: function (e) {
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../productDetail/productDetail?name=' + name,
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
  
  }
})