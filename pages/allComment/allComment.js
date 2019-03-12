//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  /**
   * 页面的初始数据
   */
  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '全部评论'
	  },
    commentList: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getCommentList()
  },
  getCommentList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/reviewCommentList', {
      submission_slug: that.data.queryObject.slug,
      page: that.data.page
    }, function (res_data) {
      pageOptions.loaded(that)
      if (res_data.code === 1000) {

        that.data.commentList = res_data.data.data
        that.setData({
          commentList: that.data.commentList
        });
      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'loading',
          duration: 2000
        });
      }
    })
  },

  upvote: function (e) {
    if (!app.globalData.userInfo.mobile) {
      this.triggerEvent('authPhone', {}, {});
      return;
    }
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    console.log(id)
    console.log(index)
    request.httpsPostRequest('/weapp/product/support/comment', { id: id }, function (res_data) {
      console.log(res_data);
      if (res_data.code === 1000) {
        that.data.commentList[index].supports = res_data.data.type == 'support' ? that.data.commentList[index].supports + 1 : that.data.commentList[index].supports - 1
        that.setData({
          commentList: that.data.commentList
        })
      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'loading',
          duration: 2000
        });
      }
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
}))