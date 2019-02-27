//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: 1,
    detail: {},
    userInfo: {},
    comment: [],
    perPage: 3,
    total: '',
    authUserPhone: false,
    isShowPopup: false,
    starNumber: '',
    tagId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      tagId: options.id
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
      that.getReviewInfo()
    });
  },
  getReviewInfo: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/info', {
      tag_name: this.data.tagId
    }, function (response) {
      var code = response.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.setData({
        detail: response.data,
        loding: 0
      })
      that.getReviewList()
    })
  },
  getReviewList: function () {
    var that = this;
    request.httpsPostRequest('/weapp/product/reviewList', {
      tag_name: that.data.detail.name,
      perPage: that.data.perPage
    }, function (response) {
      var code = response.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.data.comment = response.data.data
      that.setData({
        comment: that.data.comment,
        total: response.data.total
      })
    })
  },
  goProductDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../majorProduct/majorProduct?id=' + id,
    })
  },
  goAdd(e) {
    console.log(e, ":starNumber")
    let name = e.currentTarget.dataset.starNumber
    wx.navigateTo({
      url: '../allDianping/allDianping?name=' + name,
    })
  },
  goAllDianping(e) {
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../allDianping/allDianping?name=' + name,
    })
  },
  onAuthPhoneOk: function (e) {
    this.setData({
      authUserPhone: false,
      userInfo: app.globalData.userInfo
    });
  },

  // 成功案例
  previewImage: function (e) {
    var item = e.currentTarget.dataset.item
    // 预览图片
    if (item.type === 'image') {
      // var current = item.cover_pic;
      var attr = item.link_url.split(' ');
      wx.previewImage({
        current: item.cover_pic, // 当前显示图片的http链接
        urls: attr // 需要预览的图片http链接列表 需要是数组
      })
    }
// encodeURIComponent
    console.log(item.link_url)
    if (item.type === 'link' || item.type === 'pdf') {
      wx.navigateTo({
        url: '../url/url?url=' + encodeURIComponent(item.link_url),
      })
    }

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