// pages/detail/detail.js
//获取应用实例
var app = getApp();
//查询用户信息
var request = require("../../utils/request.js");
var WxParse = require('../../libs/wxParse/wxParse.js');

Page({
  data:{
    question: {},
    question_id: 0,
    answers: [],
    page: 1,
    isLoading: true,//是否显示加载数据提示
    isMore: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        question_id: options.id
      });
      // 查询对象
      request.httpsPostRequest('/question/info', { id: options.id }, function (res_data) {
        if (res_data.code === 1000) {
          that.setData({
            question: res_data.data.question
          });
          wx.setStorage({
            key:"question",
            data:res_data.data.question
          })
        } else {
          wx.showToast({
            title: res_data.message,
            icon: 'success',
            duration: 2000
          });
        }
      });
      //回复
      that.loadAnswers(1);
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
  loadAnswers: function(page) {
    var that = this;
    request.httpsPostRequest('/weapp/answer/list', { page: this.data.page, question_id: this.data.question_id }, function (res_data) {
      if (res_data.code === 1000) {
        var isMore = that.data.isMore;
        var nextPage = page + 1;

        if (page === 1) {
          that.data.answers = res_data.data.data;
          for (let i = 0; i < res_data.data.data.length; i++) {
            WxParse.wxParse('content' + i, 'html', res_data.data.data[i].content, that);
          }
        } else {
          for (let i = 0; i < res_data.data.data.length; i++) {
            WxParse.wxParse('content' + (that.data.answers.length + i), 'html', res_data.data.data[i].content, that);
          }
          that.data.answers = that.data.answers.concat(res_data.data.data);
        }
        if (!res_data.data.next_page_url) {
          isMore = false;
        }
        WxParse.wxParseTemArray("contentTemArray",'content', that.data.answers.length, that)

        that.setData({
          answers: that.data.answers,
          page: nextPage,
          isLoading: false,
          isMore: isMore
        });
      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  onShareAppMessage: function() {
    return{
      title: this.data.question.title,
      path: "/pages/detail/detail?id=" + this.data.question_id
    }
  },
  navToFollow: function () {
    
  },
  navToAnswer: function () {
    wx.navigateTo({
      url: '../answer/answer'
    });
  },
  navToAsk: function () {
    wx.navigateTo({
      url: '../ask/ask'
    });
  }
})