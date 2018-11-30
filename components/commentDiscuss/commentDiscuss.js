// components/commentDiscuss/commentDiscuss.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comment: Array,
    parentOwnerName: String
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
      var that = this
      console.log(this.data.productComments.feed.submission_id)
      request.httpsPostRequest('/weapp/product/support/comment', {submission_id: this.data.productComments.feed.submission_id}, function (res_data) {
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
    }
  }
})
