var app = getApp();
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '我的点评'
	  },
    list: [],
    page: 1,
    userInfo: {},
    isMore: true
  },

  onLoad: function () {
    var that = this

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
      that.loadList(1)
    });
  },

  loadList: function (page) {
    var that = this;
    request.httpsGetRequest('/weapp/product/myReview', {
      type: 2,
      page: page
    }, function (res_data) {

      pageOptions.loaded(that)

      if (res_data.code === 1000) {
        var isMore = that.data.isMore;
        var nextPage = page + 1;
        if (page === 1) {
          that.data.list = res_data.data.data;
        } else {
          that.data.list = that.data.list.concat(res_data.data.data);
        }
        if (!res_data.data.next_page_url) {
          isMore = false;
        }

        that.setData({
          list: that.data.list,
          page: nextPage,
          isMore: isMore
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

  /**页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    // 下拉刷新
    this.data.page = 1;
    this.loadList(1);
    wx.stopPullDownRefresh();
  },

  /**页面上拉触底事件的处理函数*/
  onReachBottom: function () {
    if (this.data.isMore) {
      this.loadList(this.data.page);
    }
  }
}))