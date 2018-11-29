//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loding: 1,
    detail: {},
    page: 1,
    isMore: true,
    isLoading: false,
    commentList: [],
    slug: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var slug = options.slug
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
      // console.log(that.data.detail ,':点评详情')
    })
    that.setData({
      slug: slug
    })
    that.getCommentList()
  },
  getCommentList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/reviewCommentList', {
      submission_slug: that.data.slug,
      page: that.data.page
    }, function (res_data) {
      if (res_data.code === 1000) {

        that.data.commentList = res_data.data.data;

        that.setData({
          commentList: that.data.commentList
        });
        console.log(res_data.data.data, '评论list')
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