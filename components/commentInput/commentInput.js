
var request = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tagId: {
      type: String
    },
    placeName: {
      type: String,
      value: '知音千里难寻觅，说点什么不后悔'
    },
    content: String
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
    bindTextAreaBlur (e) {
      this.setData({
        content: e.detail.value,
      })
      // console.log(e.detail.value,'input数据')
      var inputContent = e.detail.value
      this.triggerEvent('bindCode', inputContent)
    },
    submit() {
      this.triggerEvent('submit', {}, {});
    }
  }
})
