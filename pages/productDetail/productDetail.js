//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    detail: {},
    loding: 1,
    comment: [],
    perPage: 3,
    authUserPhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    var that = this;
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      });
      request.httpsGetRequest('/weapp/product/info', {
        tag_name: options.name
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
          console.log(response.data.data, ':数组')
        })
      })
    });

  },
  getUserInfo(info) {
    console.log(info.detail);
    if (info.detail.errMsg === 'getUserInfo:ok') {
      var that = this;
      request.httpsPostRequest('/weapp/user/updateUserInfo', info.detail.userInfo, function (res_data) {
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
  goProductDetail(e) {
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../productDetail/productDetail?name=' + name
    });
  },
  goAllDianping(e) {
    console.log(e, ':goAllComment')
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../allDianping/allDianping?name=' + name,
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