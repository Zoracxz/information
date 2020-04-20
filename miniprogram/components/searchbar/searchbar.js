// components/searchbar/searchbar.js
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isnavigator: {
      type: Boolean,
      value: false
    }
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
    onInputEvent(e) {
      wx.cloud.callFunction({
        name: 'search_info',
        data: {
          title: e.detail.value
        }
      }).then(res => {
        this.triggerEvent('searchinput', { result: res.result });
      })
    }
  }
})
