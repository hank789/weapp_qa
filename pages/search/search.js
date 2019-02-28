//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({
  data:{
    userInfo: {},
    list: [],
    isMore: true,
    page: 1,
    isLoading: false,//是否显示加载数据提示
    isSearching: false,
    inputVal: "",
    showNoResult: false,
    searchTip: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
      if (options.id) {
        if (options.id === '点评送咖啡') {
          that.data.inputVal = options.id
        } else {
          that.setData({
            inputVal: options.id
          });
        }
        that.loadList(1)
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  //底部更多加载
  onReachBottom: function () {
    if (this.data.isMore && this.data.inputVal) {
      this.setData({
        isLoading: true
      });
      this.loadList(this.data.page);
    }
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
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  cancelInput: function () {
    this.setData({
      inputVal: ""
    });
    wx.navigateTo({
      url: '../index/index'
    });
  },
  searchTipHidden: function () {
    if (this.data.inputVal.length > 1) {
      this.setData({
        searchTip: false
      })
    }
  },
  loadList: function (page) {
    if (!this.data.inputVal) {
      this.data.isSearching = false;
      return;
    }
    this.setData({
      isLoading: true
    })
    var that = this
    request.httpsPostRequest('/weapp/search/tagProduct', { search_word: this.data.inputVal, page: page }, function(res_data) {
      if (res_data.code === 1000) {
        var isMore = that.data.isMore;
        var nextPage = page + 1;
        if (page === 1) {
          that.data.list = res_data.data.data;
          if (!that.data.list.length) {
            that.setData({
              showNoResult: true
            })
          }
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
          isSearching: false,
          isMore: isMore
        });
      } else {
        that.setData({
          isSearching: false
        });
        wx.showToast({
          title: res_data.message,
          icon: 'loading',
          duration: 2000
        });
      }
    });
  },
  goProductDetail (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../majorProduct/majorProduct?id=' + id
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    if (e.detail.value && this.data.inputVal && this.data.isSearching === false) {
      this.data.isSearching = true;
      this.data.isMore = true;
      this.setData({
        isLoading: true
      })
      setTimeout(() => {
        this.loadList(1)
      }, 1000)
    }
  }
})