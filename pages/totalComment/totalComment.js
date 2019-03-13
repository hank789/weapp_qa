//获取应用实例
var app = getApp();
var albumUtil = require("../../utils/album.js");
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '全部评论'
	  },
    userInfo: {},
    tagName: '',
    total: '',
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
      that.getCommentList(1);
    });
  },

  getCommentList: function (page) {
    var that = this;
    albumUtil.getComments(that.data.queryObject.id, page, 20, (res) => {
      pageOptions.loaded(that)

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

}))