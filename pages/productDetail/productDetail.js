//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagId: '',
    userInfo: {},
    detail: {},
    loding: 1,
    comment: [],
    perPage: 3,
    authUserPhone: false,
    starNumber: '',
    isShowPopup: false,
    showPageMore: false,
    iconMenus: [
      {
        img: '../../images/icon2@3x.png',
        text: '生成朋友圈分享图'
      },
      {
        img: '../../images/icon1@3x.png',
        text: '生成公众号文章分享图'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {

    var that = this;
    var scene = decodeURIComponent(options.scene)
    var tagId = options.id
    if (scene !== 'undefined') {
      tagId = scene.split("=")[1];
    }
    this.setData({
      tagId: tagId
    })
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      });
      that.getReviewInfo()
    });

  },
  getReviewInfo: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/info', {
      tag_name: this.data.tagId
    }, function (response) {
      var code = response.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.setData({
        detail: response.data,
        loding: 0
      })
      that.getReviewList()
    })
  },
  getReviewList: function () {
    var that = this;
    request.httpsPostRequest('/weapp/product/reviewList', {
      tag_name: that.data.detail.name,
      perPage: that.data.perPage
    }, function (response) {
      var code = response.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.data.comment = response.data.data
      that.setData({
        comment: that.data.comment
      })
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
  goProductDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + id,
    })
  },
  goAdd(e) {
    console.log(e, ":starNumber")
    let name = e.currentTarget.dataset.starNumber
    wx.navigateTo({
      url: '../allDianping/allDianping?name=' + name,
    })
  },
  goAllDianping(e) {
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../allDianping/allDianping?name=' + name,
    })
  },
  goToDianPing(e) {
    if (!this.data.userInfo.mobile) {
      this.setData({
        authUserPhone: true,
        isShowPopup: true
      });
      return;
    }
    wx.navigateTo({
      url: '../add/add?tag=' + this.data.detail.name,
    })
  },
  goActivityDetail () {
    wx.navigateTo({
      url: '../activity/activity',
    })
  },
  popup () {
    this.setData({
      showPageMore: true
    })
    console.log('弹窗')
  },
  clickCancel () {
    this.setData({
      showPageMore: false
    })
  },
  clickItem (e) {
    console.log(e)
    if (e.detail.key === '生成朋友圈分享图') {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      request.httpsPostRequest('/weapp/product/getProductShareImage', { id: this.data.detail.id, type: 1 }, function (res_data) {
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
      });
    }

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
    this.getReviewInfo();
    wx.stopPullDownRefresh();
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
      title:this.data.detail.name,
      path:"/pages/productDetail/productDetail?id=" + this.data.detail.id
    }
  }
})