//app.js
App({
  onLaunch: function () {

  },
  getUserInfo:function(cb){
    var that = this
    if (this.globalData.appAccessToken){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res_login) {
          // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 用户已经同意小程序使用
                wx.getUserInfo({
                  withCredentials: true,
                  fail: function () {
                    // 用户拒绝授权,打开设置页面
                    wx.openSetting({
                      success: function (data) {
                        console.log("openSetting: success");
                      },
                      fail: function (data) {
                        console.log("openSetting: fail");
                      }
                    });
                  },
                  success: function (res_user) {
                    var requestUrl = "/weapp/user/wxinfo";
                    var jsonData = {
                      oauthType: 'weapp_ask',
                      code: res_login.code,
                      encryptedData: res_user.encryptedData,
                      iv: res_user.iv
                    };
                    wx.request({
                      url: that.globalData.host + requestUrl,
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      data: jsonData,
                      success: function (res) {    // 保存3rdSession到storage中
                        if (res.data.code === 1000) {
                          that.globalData.appAccessToken = res.data.data.token;
                          that.globalData.userInfo = res.data.data.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'loading',
                            duration: 2000
                          });
                        }
                      },
                      fail: function (res) {
                        console.log(res);
                      }
                    })
                  }
                })
              } else {
                var requestUrl = "/weapp/user/wxinfo";
                var jsonData = {
                  oauthType: 'weapp_ask',
                  code: res_login.code
                };
                wx.request({
                  url: that.globalData.host + requestUrl,
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  data: jsonData,
                  success: function (res) {    // 保存3rdSession到storage中
                    if (res.data.code === 1000) {
                      that.globalData.appAccessToken = res.data.data.token;
                      that.globalData.userInfo = res.data.data.userInfo
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    } else {
                      wx.showToast({
                        title: res.data.message,
                        icon: 'loading',
                        duration: 2000
                      });
                    }
                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              }
            }
          })
        }
      })
    }
  },
  onShow(){
    if(this.globalData.firstIn){
      this.globalData.firstIn = 0;
    } else{
      this.globalData.onShow = 1;
    }
  },
  onHide(){
    this.globalData.onHide = 1;
  },
  globalData:{
    userInfo: null,
    appAccessToken: null,
    firstIn:1,
    onShow: 0,
    onHide: 0,
    host: 'https://api.inwehub.com/api',
    sockHost: 'wss://read.inwehub.com'
  }
})