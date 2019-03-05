// components/commentDiscuss/commentDiscuss.js
var request = require("../../utils/request.js");
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comment: Array,
    parentOwnerName: String,
    albumId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTextArea: false,
    idName: '',
    userId: '',
    content: ''
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
          that.data.comment[index].supports = res_data.data.type == 'support' ? that.data.comment[index].supports + 1 : that.data.comment[index].supports - 1
          that.setData({
            comment: that.data.comment
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

    onAuthPhone: function (e) {
      this.triggerEvent('authPhone', {}, {});
    },

    clickComment (e) {
      var item = e.currentTarget.dataset.item
      console.log(item, '点击成功啦啦啦', this.data.albumId)
      this.setData({
        showTextArea: true,
        idName: item.owner.name,
        userId: item.id
      })
    },

    submit () {
      var that = this
      request.httpsPostRequest('/weapp/product/commentAlbum', {
        id: this.data.albumId,
        body: this.data.inputContent,
        parent_id: this.data.userId
      }, function (res) {
        console.log(res);
        if (res.code === 1000) {
          that.setData({
            content: ''
          })
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: 'loading',
            duration: 2000
          });
        }
      })
    },

    bindCode (e) {
      this.setData({
        inputContent: e.detail
      })
    },
  }
})
