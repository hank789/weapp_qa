//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    tagName: '',
    isLoading: true,//是否显示加载数据提示
    isMore: true,
    authUserPhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        tagName: options.name
      });
      that.loadList(1);
    });
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
  loadList: function (page) {
    var that = this;
    request.httpsPostRequest('/weapp/product/reviewList', {tag_name: this.data.tagName, page: page }, function(res_data) {
      console.log(res_data);
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
          isLoading: false,
          isMore: isMore
        });
      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'loading',
          duration: 2000
        });
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新
    this.data.page = 1;
    this.loadList(1);
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
      this.loadList(this.data.page);
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
      authUserPhone: true
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})