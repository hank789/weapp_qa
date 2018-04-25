// pages/detail/detail.js
//获取应用实例
var app = getApp();

//查询用户信息
var request = require("../../utils/request.js");
var pictures = [];
Page({
  data:{
    showTopTips: false,
    errorMsg: '',
    question: {
      title: '',
      question_type: 2,
      price: 0,
      hide: 0,
      device: 4,
    },
    pictures: [],
    userInfo: {},
    tags_select: [],
    tagIndex: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.data.pictures = [];
    pictures = [];//防止缓存影响

    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      if (!userInfo.id) {
        wx.showModal({
          content: '您的认证信息还未完善，前往完善信息',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../register/register'
              });
            }
          }
        });
      }
      //更新数据
      that.data.userInfo = userInfo;
      request.httpsPostRequest('/tags/load', {tag_type: 5 }, function(tag_data) {
        if (tag_data.code === 1000) {
          that.setData({
            tags_select: tag_data.data.tags
          })
        } else {
          wx.showToast({
            title: tag_data.message,
            icon: 'loading',
            duration: 2000
          });
        }
      });
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
  bindTagsChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      tagIndex: e.detail.value,
      tag: this.data.tags_select[e.detail.value].value
    })
  },
  contentEventFunc: function(e) {
    if(e.detail && e.detail.value) {
      this.data.question.title = e.detail.value;
    }
  },
  isPublicEventFunc: function (e) {
    if (e.detail && e.detail.value) {
      this.data.question.hide = e.detail.value;
    }
  },
  showTopTips: function (msg) {
    var that = this;
    this.setData({
      showTopTips: true,
      errorMsg: msg
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  formSubmit: function(e) {
    if (this.data.question.title === '') {
      this.showTopTips('内容不能为空');
      return false;
    } else {
      var jsonData = {
        title: this.data.question.title,
        hide: this.data.question.hide,
        question_type: this.data.question.question_type,
        price: this.data.question.price,
        device: this.data.question.device,
        tags: this.data.tags_select[this.data.tagIndex].value
      };
      var requestUrl = '/weapp/question/store';
      var that = this;
      var doResponse = function (res_data) {
        wx.hideLoading();
        if (res_data.data.code === 1000) {

        } else {
          wx.showToast({
            title: res_data.message,
            icon: 'success',
            duration: 2000
          });
        }
      };
      if (this.data.pictures.length >=1){
        console.log('with pictures')
        wx.showLoading({
          title: "请求处理中"
        });
        request.httpsUpload(requestUrl, jsonData, 'image_file' , this.data.pictures[0], function (res_data) {
          console.log(res_data);
          wx.hideLoading();
          if (res_data.code === 1000){
            console.log('with pictures ok')
            for (let i=1;i<=8;i++) {
              if (that.data.pictures[i]) {
                that.addQuestionImage(res_data.data.id, that.data.pictures[i], doResponse);
              }
            }
            wx.redirectTo({
              url: '../detail/detail?id='+res_data.data.id+'&share=1',
              success: function (e) {
                wx.showToast({
                  title: '问题创建成功',
                  icon: 'success',
                  duration: 1000
                });
              }
            });
          } else {
            wx.showToast({
              title: res_data.message,
              icon: 'success',
              duration: 2000
            });
          }
        });
      } else {
        request.httpsPostRequest(requestUrl, jsonData, function (res_data) {
          console.log(res_data);
          wx.hideLoading();
          if (res_data.code === 1000) {
            // 成功保存之后，执行其他逻辑.
            wx.showToast({
              title: "提问成功",
              icon: 'success',
              duration: 2000
            });
            wx.switchTab({
              url: '/pages/mine/mine'
            });
          } else {
            wx.showToast({
              title: res_data.message,
              icon: 'success',
              duration: 2000
            });
          }
        });
      }
    }
  },
  addQuestionImage: function (id, imagePath, res_func) {
    request.httpsUpload('/weapp/question/add_image', { id: id }, 'image_file', imagePath, function (res_data) {
      console.log(res_data);
      typeof res_func == "function" && res_func(res_data);
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.pictures // 需要预览的图片http链接列表
    })
  },
  chooseImage: function() {
    //上传图片相关
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;

        tempFilePaths.forEach(function(url, index){
          //   pictures.push(url);
          //   that.setData({
          //       pictures: pictures
          //   });
          let strRegex = "(.jpg|.png|.gif|.jpeg)$"; //用于验证图片扩展名的正则表达式
          let re=new RegExp(strRegex);
          if (re.test(url.toLowerCase())){
            let name = '' + index + '.' + url.split('.')[url.split('.').length - 1],localFile = url;
            pictures.push(url);
            that.setData({
              pictures: pictures
            });
          }else {
            throw "选择的不是图片";
          }

        });
      }
    });
  }
})