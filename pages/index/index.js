//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({
  data:{
    userInfo: {},
    loading: true,
    keywords: []
  },
  onLoad:function(options){
    var that = this
    // 页面初始化 options为页面跳转所带来的参数
    //调用应用实例的方法获取全局数据
     app.getUserInfo(function(userInfo){
       //更新数据
       that.setData({
         userInfo:userInfo,
         loading:false
       });
       request.httpsGetRequest('/weapp/search/getCommonTagProduct', {}, function (res_data) {
         console.log(res_data);
         if (res_data.code === 1000) {
           that.setData({
             keywords: res_data.data.words
           });
         } else {
           wx.showToast({
             title: res_data.message,
             icon: 'loading',
             duration: 2000
           });
         }
       })
     });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  inputTyping: function (e) {
    wx.navigateTo({
      url: '../search/search'
    });
  },
  navToSearch: function (e) {
    wx.navigateTo({
      url: '../search/search?id=' + e.currentTarget.dataset.id
    });
  },
  getUserInfo(info) {
    var userInfo = info.detail.userInfo;
    var that = this;
    console.log(userInfo)
    request.httpsPostRequest('/weapp/user/updateUserInfo', userInfo, function (res_data) {
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
})