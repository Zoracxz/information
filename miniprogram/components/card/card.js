// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    resources: {
      type: Array,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    toggleDelay: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemTapEvent(e){
      let item = JSON.stringify(e.currentTarget.dataset.item);
      item = encodeURIComponent(item)
      var title = e.currentTarget.dataset.title;
      this.triggerEvent('searchinput', { title: title });
      wx.navigateTo({
        url: "/pages/detail/detail?item=" + item,
      });
    }
  }
})
