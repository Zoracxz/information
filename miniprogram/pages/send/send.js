// pages/send/send.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    tabList: [],
    identity: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        identity: wx.getStorageSync('userInfo').identity
      })
    }
    if(this.data.identity <= 1){
      this.setData({
        tabList: [
          "已投递",
          "被查看",
          "待沟通",
          "面试",
          "不合适"
        ]
      })
    }else{
      this.setData({
        tabList: [
          "新简历",
          "初筛",
          "面试",
          "录用",
          "已入职"
        ]
      })
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})