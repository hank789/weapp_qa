// components/feed.js
var request = require("../../utils/request.js");
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(info) {
      console.log(info.detail);
      var that = this
      if (info.detail.errMsg === 'getUserInfo:ok') {
        var that = this;
        request.httpsPostRequest('/weapp/user/updateUserInfo', info.detail.userInfo, function (res_data) {
          console.log(res_data);
          if (res_data.code === 1000) {
            app.globalData.userInfo = res_data.data
            that.triggerEvent('authUserOk', {}, {});
          } else {
            wx.showToast({
              title: res_data.message,
              icon: 'loading',
              duration: 2000
            });
          }
        })
      }
    }
  }
})
