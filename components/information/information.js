// components/information/information.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recentNews: Object
  }, 
  options: {
    addGlobalClass: true,
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
    openLink (e) {
      wx.navigateTo({
        url: '../url/url?url=' + encodeURIComponent(e.currentTarget.dataset.url) + '&name=' + e.currentTarget.dataset.name,
      })
    }
  }
})
