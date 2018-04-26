//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({
  data:{
    userInfo: {},
    list: [],
    page: 1,
    filter: 0,
    isLoading: true,//是否显示加载数据提示
    isMore: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    this.setData({
      filter: options.filter?options.filter:0
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
      that.loadList(1);
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
  navToPost: function () {
    wx.navigateTo({
      url: '../post/post'
    });
  },
  onPullDownRefresh: function () {
    // 下拉刷新
    this.data.page = 1;
    this.loadList(1);
    wx.stopPullDownRefresh();
  },
  //底部更多加载
  onReachBottom: function () {
    if (this.data.isMore) {
      this.setData({
        isLoading: true
      });
      this.loadList(this.data.page);
    }
  },
  navToDetail: function (event) {
    wx.navigateTo({
      url: '../detail/detail?id=' + event.currentTarget.dataset.id
    });
  },
  // 申请成为招募者
  navToRegister: function (event) {
    wx.navigateTo({
      url: '../register/register'
    });
  },
  loadList: function (page) {
    var that = this;
    request.httpsPostRequest('/weapp/question/allList', { page: page, filter: this.data.filter, order_by: 1 }, function(res_data) {
      console.log(res_data);
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
  }
})