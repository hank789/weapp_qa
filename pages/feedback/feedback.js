//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");
var pictures = [];
Page({

  /**
   * 页面的初始数据
   */

  data: {
    description: '',
    pictures: [],
    type: '',
    feedBackInfo: [
      {
        id: 1,
        text: '信息勘误'
      },
      {
        id: 2,
        text: '功能建议'
      },
      {
        id: 3,
        text: 'BUG反馈'
      },
      {
        id: 4,
        text: '不良举报'
      },
      {
        id: 5,
        text: '其他'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindFormSubmit: function (e) {
    var that = this;
    var content = that.data.type + '/具体表述：' + e.detail.value.description
    if (!that.data.type) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    if (!e.detail.value.description) {
      wx.showToast({
        title: '请输入具体描述',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    request.httpsPostRequest('/weapp/product/feedback', {
      title: '反馈内容',
      content: content
    }, function (response) {
      var code = response.code
      if (code !== 1000) {
        wx.showToast({
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
      wx.showToast({
        title: '提交成功',
        icon: 'loading',
        duration: 2000,
        success: function (res) {
          wx.navigateBack({ changed: true })
        }
      })
      
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
  feedBack: function (e) {
    var that = this;
    var text = e.currentTarget.dataset.name;
    that.setData({
      type: text
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.pictures // 需要预览的图片http链接列表
    })
  },
  chooseImage: function () {
    //上传图片相关
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;

        tempFilePaths.forEach(function (url, index) {
          //   pictures.push(url);
          //   that.setData({
          //       pictures: pictures
          //   });
          let strRegex = "(.jpg|.png|.gif|.jpeg)$"; //用于验证图片扩展名的正则表达式
          let re = new RegExp(strRegex);
          if (re.test(url.toLowerCase())) {
            let name = '' + index + '.' + url.split('.')[url.split('.').length - 1], localFile = url;
            pictures.push(url);
            that.setData({
              pictures: pictures
            });
          } else {
            throw "选择的不是图片";
          }

        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '问题反馈',
      path: '/pages/feedback/feedback'
    }
  }
})