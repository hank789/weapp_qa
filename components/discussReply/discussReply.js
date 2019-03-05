// components/discussReply/discussReply.js
var request = require("../../utils/request.js");
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentChildren: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    upvote: function (e) {
      if (!app.globalData.userInfo.mobile) {
        this.triggerEvent('authPhone', {}, {});
        return;
      }
      var id= e.currentTarget.dataset.id
      var index = e.currentTarget.dataset.index
      var that = this
      console.log(id)
      console.log(index)
      request.httpsPostRequest('/weapp/product/support/comment', {id: id}, function (res_data) {
        console.log(res_data);
        if (res_data.code === 1000) {
          that.data.commentChildren[index].supports = res_data.data.type == 'support' ? that.data.commentChildren[index].supports + 1 : that.data.commentChildren[index].supports - 1
          that.setData({
            commentChildren: that.data.commentChildren
          })
        } else {
          wx.showToast({
            title: res_data.message,
            icon: 'loading',
            duration: 2000
          });
        }
      })
    },
  }
})
