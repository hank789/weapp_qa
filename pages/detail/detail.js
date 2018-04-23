// pages/detail/detail.js
//获取应用实例
var app = getApp();
//查询用户信息
var util = require('../../utils/util.js');
var request = require("../../utils/request.js");

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
    request.httpsPostRequest('/question/answerList', { page: this.data.page, question_id: this.data.question_id }, function (res_data) {
      if (res_data.code === 1000) {
        var isMore = that.data.isMore;
        var nextPage = page + 1;
        if (page === 1) {
          that.data.answers = res_data.data.data;
        } else {
          that.data.answers = that.data.answers.concat(res_data.data.data);
        }
        if (!res_data.data.next_page_url) {
          isMore = false;
        }

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
      title:"快来帮我解决问题",
      path:"./page/user?id=123"
    }
  }
})