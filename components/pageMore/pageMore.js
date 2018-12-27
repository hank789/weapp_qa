// components/pageMore/pageMore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iconMenu: Array,
    showPageMore: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickItem(event) {
      this.triggerEvent('myevent', { key: event.currentTarget.dataset.key})
    },
    cancel () {
      this.triggerEvent('clickCancel',{})
    }
  }
})
