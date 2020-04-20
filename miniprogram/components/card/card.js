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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemTapEvent(e){
      var id = e.currentTarget.dataset.id;
      var title = e.currentTarget.dataset.title;
      console.log(e)
      this.triggerEvent('searchinput', { title: title });
      wx.navigateTo({
        url: "/pages/detail/detail?id=" + id,
      });
    }
  }
})
