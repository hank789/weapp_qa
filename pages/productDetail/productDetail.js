//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    loding: 1,
    productComments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    var that = this
    request.httpsGetRequest('/weapp/product/info', { 
      tag_name: options.name
    }, function (response) {
      var code = response.data.code
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
      
      request.httpsPostRequest('/weapp/product/reviewList', {
        tag_name: that.data.detail.name
      }, function (response) {
        var code = response.data.code
        if (code !== 1000) {
          wx.showToast({
            title: response.message,
            icon: 'loading',
            duration: 2000
          })
        }
        that.data.productComments = response.data
        that.setData({
          productComments: that.data.productComments
        })
        console.log(response.data, ':数组')
      })

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