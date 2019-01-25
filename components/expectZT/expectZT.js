var request = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean
  },
  /**
   * 组件的初始数据
   */
  data: {
    voteTitle: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    voteTitle: function (e) {
      this.setData({
        voteTitle: e.detail.value
      })
      console.log(this.data.voteTitle, 'input数据')
    },

    submit (e) {
      console.log(e,'提交成功')

      request.httpsPostRequest('/system/feedback', {
        title: this.data.voteTitle,
        content: this.data.voteTitle
      }, function (res) {
        var code = res.code
        if (code !== 1000) {
          wx.showToast({
            title: res.message,
            icon: 'loading',
            duration: 1000
          })
          return
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
        }
        
      })
      this.setData({
        isShow: false,
        voteTitle: ''
      })
    }
  }
})
