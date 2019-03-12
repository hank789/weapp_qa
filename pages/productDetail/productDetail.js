//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '分享产品'
	  },
    tagId: '',
    userInfo: {},
    detail: {},
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

  onLoad:function () {

    var that = this;
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo,
	      autoShareParams: {
		      title: that.data.detail.name
	      },
      });
      that.getReviewInfo()
    });

  },
  goFeedBack: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  getReviewInfo: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/info', {
      tag_name: this.data.queryObject.id
    }, function (response) {

      pageOptions.loaded(that)

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
    var that = this;
    var size = 1
    if (e.detail.key === '生成公众号文章分享图') {
      size = 2
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    request.httpsGetRequest('/weapp/product/getProductShareImage', { id: that.data.detail.id, type: size }, function (res_data) {
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
  goSpecial (e) {
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    if (type === 2) {
      wx.navigateTo({
        url: '../specialDetail/specialDetail?id=' + id
      })
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
}))