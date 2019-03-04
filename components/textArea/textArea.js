
var request = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tagId: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindTextAreaBlur (e) {
      console.log(e.detail.value)
      this.setData({
        content: e.detail.value,
      })
    },
    submit () {
      var that = this
      request.httpsPostRequest('/weapp/product/commentAlbum', {
        id: this.data.tagId,
        body: this.data.content,
        parent_id: '0'
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
    }
  }
})
