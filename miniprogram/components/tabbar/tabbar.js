// components/tabbar/tabbar.js
const app = getApp(); 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Index: { // 当前页          
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 这里是一些组件内部数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 这里是一个自定义方法
    goHome: (e) => {
      // 判断是否为主页面防止原地跳转
      if (e.currentTarget.dataset.hi != 0) {
        wx.reLaunch({
          url: "/pages/index/index"
        })
      }
    },
    goSend: (e) => {
      if (e.currentTarget.dataset.hi != 1 || e.currentTarget.dataset.hi != 3) {
        wx.redirectTo({
          url: "/pages/send/send"
        })
      }
      
    },
    goMy: (e) => {
      if (app.globalData.isLogin != "isLogin") {
        wx.redirectTo({
          url: '/pages/login/login'
        })
        return;
      }else{
        if (e.currentTarget.dataset.hi != 2) {
          wx.redirectTo({
            url: "/pages/my/my"
          })
        }
        
      }
    },
  }
})
