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
		  title: '所有点评'
	  },
    list: [],
    page: 1,
    isLoading: true,//是否显示加载数据提示
    isMore: true,
    authUserPhone: false,
    isShowPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo,
	      autoShareParams: {
		      title: that.data.queryObject.name
	      },
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
    request.httpsPostRequest('/weapp/product/reviewList', {tag_name: this.data.queryObject.name, page: page }, function(res_data) {
      console.log(res_data);

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
      authUserPhone: true,
      isShowPopup: true
    });
  },
}))