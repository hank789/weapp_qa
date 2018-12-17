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
    product: {},
    title: '',
    rate_star: 4,
    hide: 0,
    tags: 0,
    categoryArr: [],
    pictures: [],
    userInfo: {},
    identity_select: [],
    identityIndex: 0,
    tag: '',
    starNumber: ''
  },
  oneStar: function() {
    var that = this
    that.setData({
      starNumber: 1
    })
  },
  twoStar: function () {
    var that = this
    that.setData({
      starNumber: 2
    })
  },
  threeStar: function () {
    var that = this
    that.setData({
      starNumber: 3
    })
  },
  fourStar: function () {
    var that = this
    that.setData({
      starNumber: 4
    })
  },
  fiveStar: function () {
    var that = this
    that.setData({
      starNumber: 5
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.data.pictures = [];
    pictures = [];//防止缓存影响
    var tagName = options.tag
    var starMark = options.starMark
    var that = this;
    if (starMark) {
      that.setData({
        starNumber: starMark
      })
    }
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      if (!userInfo.mobile) {
        wx.showModal({
          content: '您的认证信息还未完善，前往完善信息',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../productDetail/productDetail?id=' + tagName
              });
            }
          }
        });
      }
      that.setData({
        userInfo:userInfo,
        tag: tagName
      });
      //更新数据
      request.httpsPostRequest('/tags/load', {tag_type: 8 }, function(tag_data) {
        if (tag_data.code === 1000) {
          that.setData({
            identity_select: tag_data.data.tags
          })
        } else {
          wx.showToast({
            title: tag_data.message,
            icon: 'loading',
            duration: 2000
          });
        }
      });
      request.httpsGetRequest('/weapp/product/info', {tag_name: tagName}, function (response) {
        var code = response.code
        if (code !== 1000) {
          wx.showToast({
            title: response.message,
            icon: 'loading',
            duration: 2000
          })
        }
        for (var i in response.data.categories) {
          var item = response.data.categories[i]
          that.data.categoryArr.push({
            id: item.id,
            name: item.name,
            selected: 1
          })
        }
        that.setData({
          product: response.data,
          categoryArr: that.data.categoryArr
        })

      })
    });
  },
  selectCategory: function (e) {
    var id = e.target.dataset.id
    for(let i=0;i<this.data.categoryArr.length;i++) {
      if (this.data.categoryArr[i].id === id) {
        this.data.categoryArr[i].selected = !this.data.categoryArr[i].selected
      }
    }

    this.setData({
      categoryArr: this.data.categoryArr
    })
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
  bindIdentityChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      identityIndex: e.detail.value
    })
  },
  bindTitleBlur: function(e) {
    if(e.detail && e.detail.value) {
      this.setData({
        title: e.detail.value
      })
    }
  },
  bindHideChange: function (e) {
    if (e.detail && e.detail.value) {
      this.setData({
        hide: e.detail.value
      })
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
    var cids = []
    for(let i=0;i<this.data.categoryArr.length;i++) {
      if (this.data.categoryArr[i].selected) {
        cids.push(this.data.categoryArr[i].id)
      }
    }
    if (this.data.starNumber === '') {
      this.showTopTips('您还没有给星级打分');
      return false
    }
    if (this.data.title === '') {
      this.showTopTips('内容不能为空');
      return false;
    }
    if (cids.length === 0) {
      this.showTopTips('请选择领域');
      return false;
    }

    var jsonData = {
      title: this.data.title,
      hide: this.data.hide?1:0,
      type: 'review',
      category_ids: cids,
      tags: this.data.product.id,
      rate_star: this.data.starNumber,
      identity: this.data.identity_select[this.data.identityIndex].value
    };
    var requestUrl = '/weapp/product/storeReview';
    var that = this;
    var doResponse = function (res_data) {
      wx.hideLoading();
      if (res_data.code === 1000) {

      } else {
        wx.showToast({
          title: res_data.message,
          icon: 'success',
          duration: 2000
        });
      }
    };
    request.httpsPostRequest(requestUrl, jsonData, function (res_data) {
      console.log(res_data, '数据');
      console.log(that.data.userInfo, ':userInfo')
      wx.hideLoading();
      if (res_data.code === 1000) {
        if (that.data.pictures.length >=1) {
          for (let i=0;i<=8;i++) {
            if (that.data.pictures[i]) {
              that.addQuestionImage(res_data.data.id, that.data.pictures[i], doResponse);
            }
          }
        }
        wx.redirectTo({
          url: '../publish/publish?slug=' + res_data.data.slug + '&name=' + that.data.userInfo.name + '&tag=' + that.data.tag,
          // url: '../commentDetail/commentDetail?slug=' + res_data.data.slug,
          // success: function (e) {
          //   wx.showToast({
          //     title: '点评成功',
          //     icon: 'success',
          //     duration: 1000
          //   });
          // }
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
  addQuestionImage: function (id, imagePath, res_func) {
    request.httpsUpload('/weapp/product/addReviewImage', { id: id }, 'image_file', imagePath, function (res_data) {
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