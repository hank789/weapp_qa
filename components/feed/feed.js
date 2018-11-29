// components/feed.js
var request = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productComments: Object
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
      var that = this
      console.log(this.data.productComments.feed.submission_id)
      request.httpsPostRequest('/weapp/product/upvoteReview', {submission_id: this.data.productComments.feed.submission_id}, function (res_data) {
        console.log(res_data);
        if (res_data.code === 1000) {
          that.setData({
            'productComments.feed.support_number': res_data.data.type == 'upvote' ? that.data.productComments.feed.support_number + 1 : that.data.productComments.feed.support_number - 1
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
    downvote: function (e) {
      var that = this
      console.log(this.data.productComments.feed.submission_id)
      request.httpsPostRequest('/weapp/product/downvoteReview', {submission_id: this.data.productComments.feed.submission_id}, function (res_data) {
        console.log(res_data);
        if (res_data.code === 1000) {
          that.setData({
            'productComments.feed.downvote_number': res_data.data.type == 'downvote' ? that.data.productComments.feed.downvote_number + 1 : that.data.productComments.feed.downvote_number - 1
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
    goCommentDetail: function (e) {
      console.log(e, ":slug")
      let slug = e.currentTarget.dataset.slug
      wx.navigateTo({
        url: '../commentDetail/commentDetail?slug=' + slug,
      })
    }
  }
})
