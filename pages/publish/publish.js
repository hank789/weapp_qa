// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    productName: '',
    slug: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '：参数')
    var that = this;
    let userName = options.name;
    let productName = options.tag;
    let slug = options.slug;
    that.setData({
      userName: userName,
      productName: productName,
      slug: slug
    })
    console.log(that.data.userName + ':' + that.data.productName + ':' + that.data.slug + ':取到名字了吗')
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.userName + '对「' + this.data.productName + '」的点评',
      path: "/pages/commentDetail/commentDetail?slug=" + this.data.slug
    }
  }
})