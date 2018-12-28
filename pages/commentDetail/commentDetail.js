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
    authUserPhone: false,
    isShowPopup: false, 
    showPageMore: false,
    iconMenus: [
      {
        img: '../../images/icon3@3x.png',
        text: '生成长图'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var slug = options.slug
    var scene = decodeURIComponent(options.scene)
    if (scene !== 'undefined') {
      slug = scene.split("=")[1];
    }
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
  goAllComment: function (e) {
    let slug = e.currentTarget.dataset.slug
    var that = this
  
    wx.navigateTo({
      url: '../allComment/allComment?slug=' + slug,
    })
  },
  getCommentList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/reviewCommentList', {
      submission_slug: that.data.slug,
      page: that.data.page,
      perPage: 150
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
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + id,
    })
  },
  onAuthPhone: function (e) {
    this.setData({
      authUserPhone: true,
      isShowPopup: true
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
        authUserPhone: true,
        isShowPopup: true
      });
      return;
    }
    if (this.data.detail.is_downvoted) return;
    var that = this
    request.httpsPostRequest('/weapp/product/upvoteReview', {submission_id: this.data.detail.id}, function (res_data) {
      console.log(res_data);
      if (res_data.code === 1000) {
        that.setData({
          'detail.is_upvoted': res_data.data.type == 'upvote'?1:0,
          'detail.upvotes': res_data.data.type == 'upvote'?that.data.detail.upvotes+1:that.data.detail.upvotes-1
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
  downvote: function (e) {
    if (!this.data.userInfo.mobile) {
      this.setData({
        authUserPhone: true,
        isShowPopup: true
      });
      return;
    }
    if (this.data.detail.is_upvoted) return;
    var that = this
    request.httpsPostRequest('/weapp/product/downvoteReview', {submission_id: this.data.detail.id}, function (res_data) {
      console.log(res_data);
      if (res_data.code === 1000) {
        that.setData({
          'detail.is_downvoted': res_data.data.type == 'downvote'?1:0,
          'detail.downvotes': res_data.data.type == 'downvote'?that.data.detail.downvotes+1:that.data.detail.downvotes-1
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
  goActivityDetail() {
    wx.navigateTo({
      url: '../activity/activity',
    })
  },


  popup() {
    this.setData({
      showPageMore: true
    })
  },
  clickCancel() {
    this.setData({
      showPageMore: false
    })
  },
  clickItem(e) {
    var that = this;
    console.log(e)
    var size = 1
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    request.httpsPostRequest('/weapp/product/getReviewShareImage', { id: that.data.detail.id, type: size }, function (res_data) {
      if (res_data.code === 1000) {
        wx.hideLoading();
        wx.previewImage({
          current: res_data.data.url, // 当前显示图片的http链接
          urls: [res_data.data.url]
        })
      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'success',
          duration: 2000
        });
      }
      that.clickCancel()
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
    this.getCommentList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCommentList()
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