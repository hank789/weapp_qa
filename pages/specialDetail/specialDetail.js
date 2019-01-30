//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: 1,
    list: [],
    userInfo: {},
    albumInfo: {},
    id: '',
    isMore: true,
    page: 1,
    // isShowAddOne: false,
    authUserPhone: false,
    isShowPopup: false, 
    supportsList: [],
    supportData: {},
    showGood: false,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options,'数据')
    that.data.id = options.id

    // 获取用户信息
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
      that.getProductList(1)
      that.getAlbumInfo()
      that.getSupportsList()
    });
    var roll = setInterval(function () { setRoll() }, 3300);
    function setRoll() {
      var list = that.data.supportsList
      var index = that.data.index
      if (list[index]) {
        that.setData({
          supportData: list[index],
          showGood: true,
          index: index + 1
        })
      }
      setTimeout(() => {
        that.setData({
          showGood: false,
        })
      }, 3200)
      if (index === list.length) {
        clearInterval(roll);
      }
    }
    
    
    
  },
  getAlbumInfo: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/albumInfo', {
      id: that.data.id
    }, function (res) {
      var code = res.code
      if (code !== 1000) {
        wx.showToast({
          title: res.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.setData({
        albumInfo: res.data
      })
    })
  },
  getProductList: function (page) {
    var that = this;
    request.httpsGetRequest('/weapp/product/albumProductList', {
      id: that.data.id,
      page: page
    }, function (response) {
      var res_data = response
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
          title: response.message,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  discoverDown: function (e) {

    if (!this.data.userInfo.mobile) {
      this.setData({
        authUserPhone: true,
        isShowPopup: true
      });
      return;
    }

    var that = this;
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    request.httpsPostRequest('/weapp/product/supportAlbumProduct', {
      id: item.id
    }, function (res) {
      var code = res.code
      var support = "list[" + index + "].can_support"
      if (code === 6120) {
        wx.showToast({
          title: '今天不能点赞了哦',
          icon: 'loading',
          duration: 1000
        })
        that.setData({
          [support]: 0
        })
        return
      }
      var up = "list[" + index + "].support_rate";
      var isShowAddOne = "list[" + index + "].isShowAddOne"
      that.setData({
        [up]: item.support_rate + 1,
        [isShowAddOne]: true
      })
      setTimeout(() => {
        that.setData({
          [isShowAddOne]: false
        })
      }, 1500)
    })
  },

  getSupportsList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/getAlbumSupports', {
      id: that.data.id
    }, function (res) {
      var code = res.code
      if (code !== 1000) {
        wx.showToast({
          title: res.message,
          icon: 'loading',
          duration: 2000
        })
      }
      that.setData({
        supportsList: res.data
      })
    })
  },
  goProductDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + id
    });
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
    this.data.page = 1;
    this.getProductList(1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMore) {
      this.setData({
        isLoading: true
      });
      this.getProductList(this.data.page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})