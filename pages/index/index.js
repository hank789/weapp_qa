//获取应用实例
var app = getApp();
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js")

Page(pageOptions.getOptions({
  data:{
    userInfo: {},
    keywords: [],
    scrollindex: 0,  //当前页面的索引值
    totalnum: 2,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    critical: 100, //触发翻页的临界值
    margintop: 0,  //滑动下拉距离
    data: 5,
    list: [],
    showPopup: false,
	  isAddWeChat: false
  },
  onLoad:function(options){
    console.log(options,'数据')
    var that = this
    var goto = options.goto
    if (options.goto === 'zhuanti') {
      that.setData({
        scrollindex: 1
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
    //调用应用实例的方法获取全局数据
     app.getUserInfo(function(userInfo){

       pageOptions.loaded(that)

       //更新数据
       that.setData({
         userInfo:userInfo
       });
       request.httpsGetRequest('/weapp/search/getCommonTagProduct', {}, function (res_data) {
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
       if (that.data.scrollindex == 1) {
         request.httpsPostRequest('/weapp/product/feedback', {
           title: '进入小程序专题集',
           content: '/pages/index/index'
         }, null)
       }
     });
  },
  getAlbumList: function () {
    var that = this;
    request.httpsGetRequest('/weapp/product/albumList', {
      perPage: 100
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

      listArry.push({
          type: 'lastElement',
      })

      let len = listArry.length;
      let n = 5; //假设每行显示5个
      let lineNum = len % 5 === 0 ? len / 5 : Math.ceil(len / 5);
      let resD = [];
      for (let i = 0; i < lineNum; i++) {
        let temp = listArry.slice(i * n, i * n + n);
        resD.push(temp);
      }


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
	copyText () {
    var that = this
		wx.setClipboardData({
			data: 'hiinwe',
			success(res) {
				wx.hideToast();
				wx.getClipboardData({
					success(res) {
						that.setData({
						  isAddWeChat: true
            })
						setTimeout(function () {
							that.setData({
								isAddWeChat: false
							})
						}, 1500)
					}
				})
			}
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
    if (d.endy - d.starty > 100 && d.scrollindex > 0 && d.margintop) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.totalnum - 1 && d.margintop) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
    if (this.data.scrollindex == 1) {
      request.httpsPostRequest('/weapp/product/feedback', {
        title: '进入小程序专题集',
        content: '/pages/index/index'
      }, null)
    }
  },
  showExpect () {
    this.setData({
      showPopup: true
    })
  }
}))