//获取应用实例
var app = getApp();
var albumUtil = require("../../utils/album.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    tagName: '',
    total: '',
    commentList: [],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        id: options.id
      });
      that.getCommentList(1);
    });
  },

  getCommentList: function (page) {
    var that = this;
    albumUtil.getComments(that.data.id, page, 20, (res) => {

      var nextPage = page + 1;
      if (page === 1) {
        that.data.commentList = res.data.data;
      } else {
        that.data.commentList = that.data.commentList.concat(res.data.data);
      }

      that.setData({
        commentList: that.data.commentList,
        total: res.data.total,
        page: nextPage,
      });
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
    this.getCommentList(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCommentList(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})