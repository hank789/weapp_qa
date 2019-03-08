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
		  title: '更多咨询'
	  },
    newsList: [],
    page: 1,
    tagName: '',
    userInfo: {},
    isLoading: true,//是否显示加载数据提示
    isMore: true,
    authUserPhone: false,
    isShowPopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
      that.getRecentNews(1)
    });
  },
  getRecentNews: function(page) {
    var that = this
    var api
    var data = {}
    if (that.data.queryObject.type === 'product') {
      api = '/weapp/product/newsList'
      data = {
        tag_id: that.data.queryObject.id,
        page: page
      }
    }
    if (that.data.queryObject.type === 'album') {
      data = {
        id: that.data.queryObject.id,
        page: page
      }
      api = '/weapp/product/albumNewsList'
    }
    request.httpsPostRequest(api, data, function (response) {
      var code = response.code
      if (response.code === 1000) {
        var isMore = that.data.isMore;
        var nextPage = page + 1;
        if (page === 1) {
          that.data.newsList = response.data.data;
        } else {
          that.data.newsList = that.data.newsList.concat(response.data.data);
        }
        if (!response.data.next_page_url) {
          isMore = false;
        }
        that.setData({
          newsList: that.data.newsList,
          page: nextPage,
          isLoading: false,
          isMore: isMore
        });
      } else {
        wx.showToast({
          title: response.message,
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
    this.data.page = 1;
    this.getRecentNews(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMore) {
      this.setData({
        isLoading: true
      });
      this.getRecentNews(this.data.page);
    }
  },
  getUserPhone(e) {
    console.log(e.detail)
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      var that = this;
      request.httpsPostRequest('/weapp/user/updatePhone', e.detail, function (res_data) {
        console.log(res_data);
        if (res_data.code === 1000) {
          app.globalData.userInfo = res_data.data

          that.setData({
            userInfo: res_data.data
          });
        } else {
          wx.showToast({
            title: res_data.message,
            icon: 'loading',
            duration: 2000
          });
        }
      })
    }
  },
  onAuthPhone: function (e) {
    this.setData({
      authUserPhone: true,
      isShowPopup: true
    });
  },
}))