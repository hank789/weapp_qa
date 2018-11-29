// components/feed.js
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
    goCommentDetail: function (e) {
      console.log(e, ":slug")
      let slug = e.currentTarget.dataset.slug
      wx.navigateTo({
        url: '../commentDetail/commentDetail?slug=' + slug,
      })
    }
  }
})
