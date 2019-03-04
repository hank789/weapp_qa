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
      that.setData({
        commentList: res.data.data,
        total: res.data.total
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