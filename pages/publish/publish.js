var pageOptions = require("../../utils/pageOptions.js");

Page(pageOptions.getOptions({

  data: {
	  autoShareCurPage: true,
	  autoShareParams: {
		  title: '天冷点赞送我杯咖啡，点评有礼你也来参与',
		  imageUrl: '../../images/shareImg@2x.png'
	  },
  },

  onLoad: function (options) {
  },
  goMyComment () {
    wx.redirectTo({
      url: '../myComment/myComment',
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
}))