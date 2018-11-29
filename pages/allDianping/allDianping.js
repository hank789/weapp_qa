//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [],
    name: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = options.name
    this.setData({
      name: name
    })
    if (name) {
      this.commentList(this.data.page)
    }
    
  },

  commentList: function (page) {
    var that = this
    request.httpsPostRequest('/weapp/product/reviewList', {
      tag_name: that.data.name,
      page: page
    }, function (response) {
      var code = response.data.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      var nextPage = page + 1
      that.data.comment = response.data.data
      that.setData({
        comment: that.data.comment,
        page: nextPage
      })
      console.log(response.data.data, ':数组')
    })
  },

  /**页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    this.commentList(this.data.page)
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

  /*生命周期函数--监听页面卸载*/
  onUnload: function () {
  
  },

  /* 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})