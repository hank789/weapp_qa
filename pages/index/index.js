//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

Page({
  data:{
    userInfo: {},
    loading: true,
    keywords: [],
    scrollindex: 0,  //当前页面的索引值
    totalnum: 2,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    critical: 100, //触发翻页的临界值
    margintop: 0,  //滑动下拉距离
    data: 5,
    list: []
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
       that.getAlbumList()
     });
  },
  getAlbumList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/albumList', {
    }, function (res) {
      var code = res.code
      if (code !== 1000) {
        wx.showToast({
          title: res.message,
          icon: 'loading',
          duration: 2000
        })
      }
      let listArry = res.data.data
      let len = listArry.length;
      let n = 5; //假设每行显示5个
      let lineNum = len % 5 === 0 ? len / 5 : Math.ceil(len / 5);
      let resD = [];
      for (let i = 0; i < lineNum; i++) {
        let temp = listArry.slice(i * n, i * n + n);
        resD.push(temp);
      }

      console.log(resD, '数据')

      that.setData({
        list: resD
      })
    })
  },
  goDetail (e) {
    wx.navigateTo({
      url: '../specialDetail/specialDetail?id=' + e.currentTarget.dataset.id
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
  onAuthUserOk: function (e) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  onShareAppMessage: function () {
    return{
      title:'推荐 企业服务点评 给你，去试试',
      path:"/pages/index/index"
    }
  },
  downloadApp: function (e) {
    
  },

  scrollTouchstart: function (e) {
    let py = e.touches[0].pageY;
    this.setData({
      starty: py
    })
  },
  scrollTouchmove: function (e) {
    let py = e.touches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py,
    })
    if (py - d.starty < 100 && py - d.starty > -100) {
      this.setData({
        margintop: py - d.starty
      })
    }
  },
  scrollTouchend: function (e) {
    let d = this.data;
    if (d.endy - d.starty > 100 && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.totalnum - 1) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
  },

})