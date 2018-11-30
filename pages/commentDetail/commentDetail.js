//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loding: 1,
    userInfo: {},
    detail: {},
    page: 1,
    isMore: true,
    isLoading: false,
    commentList: [],
    slug: '',
    commentTotal: '',
    authUserPhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var slug = options.slug
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo,
        slug: slug
      });
      request.httpsGetRequest('/weapp/product/reviewInfo', {
        slug: options.slug
      }, function (response) {
        var code = response.code
        if (code !== 1000) {
          wx.showToast({
            title: response.message,
            icon: 'loading',
            duration: 2000
          })
        }
        that.data.detail = response.data
        that.setData({
          detail: that.data.detail,
          loding: 0
        })
      })
      that.getCommentList()
    })
  },
  getCommentList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/reviewCommentList', {
      submission_slug: that.data.slug,
      page: that.data.page
    }, function (res_data) {
      if (res_data.code === 1000) {

        that.data.commentList = res_data.data.data;
        that.data.commentTotal = res_data.data.total
        that.setData({
          commentList: that.data.commentList,
          commentTotal: that.data.commentTotal
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
  goProductDetail: function (e) {
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../productDetail/productDetail?name=' + name,
    })
  },
  onAuthPhone: function (e) {
    this.setData({
      authUserPhone: true
    });
  },
  onAuthPhoneOk: function (e) {
    this.setData({
      authUserPhone: false,
      userInfo: app.globalData.userInfo
    });
  },
  onAuthUserOk: function (e) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  upvote: function (e) {
    if (!this.data.userInfo.mobile) {
      this.setData({
        authUserPhone: true
      });
      return;
    }
    var that = this
    request.httpsPostRequest('/weapp/product/upvoteReview', {submission_id: this.data.detail.id}, function (res_data) {
      console.log(res_data);
      if (res_data.code === 1000) {

      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'loading',
          duration: 2000
        });
      }
    })
  },
  downvote: function (e) {
    if (!this.data.userInfo.mobile) {
      this.setData({
        authUserPhone: true
      });
      return;
    }
    var that = this
    request.httpsPostRequest('/weapp/product/downvoteReview', {submission_id: this.data.detail.id}, function (res_data) {
      console.log(res_data);
      if (res_data.code === 1000) {
        
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title:this.data.detail.owner.name + '对「' + this.data.detail.tags[0].name +'」的点评',
      path:"/pages/commentDetail/commentDetail?slug=" + this.data.slug
    }
  }
})