// components/markStar/markStar.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    starNumber: Number,
    showNumber: Boolean,
    name: String
  },
  optios: {
    addGlobalClass: true
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
    
    oneStar: function (e) {
      if (!app.globalData.userInfo.mobile) {
        this.triggerEvent('authPhone', {}, {});
        return;
      }
      var starMark = e.currentTarget.dataset.mark
      var that = this
      if (that.data.name) {
        wx.navigateTo({
          url: '../add/add?tag=' + this.data.name + '&starMark=' + starMark,
        })
      }
      that.setData({
        starNumber: 1
      })
    },
    twoStar: function (e) {
      if (!app.globalData.userInfo.mobile) {
        this.triggerEvent('authPhone', {}, {});
        return;
      }
      var starMark = e.currentTarget.dataset.mark
      var that = this
      if (that.data.name) {
        wx.navigateTo({
          url: '../add/add?tag=' + this.data.name + '&starMark=' + starMark,
        })
      }
      that.setData({
        starNumber: 2
      })
    },
    threeStar: function (e) {
      if (!app.globalData.userInfo.mobile) {
        this.triggerEvent('authPhone', {}, {});
        return;
      }
      var starMark = e.currentTarget.dataset.mark
      var that = this
      if (that.data.name) {
        wx.navigateTo({
          url: '../add/add?tag=' + this.data.name + '&starMark=' + starMark,
        })
      }
      that.setData({
        starNumber: 3
      })
    },
    fourStar: function (e) {
      if (!app.globalData.userInfo.mobile) {
        this.triggerEvent('authPhone', {}, {});
        return;
      }
      var starMark = e.currentTarget.dataset.mark
      var that = this
      if (that.data.name) {
        wx.navigateTo({
          url: '../add/add?tag=' + this.data.name + '&starMark=' + starMark,
        })
      }
      that.setData({
        starNumber: 4
      })
    },
    fiveStar: function (e) {
      if (!app.globalData.userInfo.mobile) {
        this.triggerEvent('authPhone', {}, {});
        return;
      }
      var starMark = e.currentTarget.dataset.mark
      var that = this
      if (that.data.name) {
        wx.navigateTo({
          url: '../add/add?tag=' + this.data.name + '&starMark=' + starMark,
        })
      }
      that.setData({
        starNumber: 5
      })
    }
  }
})
