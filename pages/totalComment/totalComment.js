//获取应用实例
var app = getApp();
var albumUtil = require("../../utils/album.js");
var request = require("../../utils/request.js");

var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '全部评论'
	  },
    userInfo: {},
    tagName: '',
    total: '',
    commentList: [],
	  isLoading: true,//是否显示加载数据提示
	  isMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
      that.getCommentList(1);
    });
  },

  getCommentList (page) {
    var that = this;
    albumUtil.getComments(that.data.queryObject.id, page, 20, (res_data) => {
      pageOptions.loaded(that)

	    if (res_data.code === 1000) {
		    var isMore = that.data.isMore;
		    var nextPage = page + 1;
		    if (page === 1) {
			    that.data.list = res_data.data.data;
		    } else {
			    that.data.list = that.data.list.concat(res_data.data.data);
		    }
		    if (!res_data.data.next_page_url) {
			    isMore = true;
		    }

		    that.setData({
			    commentList: that.data.list,
			    total: res_data.data.total,
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
	  // 下拉刷新
	  this.data.page = 1;
	  this.getCommentList(1);
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
		  this.getCommentList(this.data.page)
	  }
  },

}))