
var request = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    submit () {
      request.httpsPostRequest('/weapp/product/commentAlbum', {
        id: '2726',
        body: '评论的内容56567565下午4点51分',
        parent_id: '0'
      }, function (res) {
        console.log(res);
        if (res.code === 1000) {
          console.log('评论成功')
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
