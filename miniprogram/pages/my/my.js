// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: './user-unlogin.png',
    openid: '',
    logged: false,
    username: '',
    identity: '',
    showImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.isLogin) {
      this.setData({
        logged: true,
        userInfo: wx.getStorageSync('userInfo'),
        avatarUrl: app.globalData.avatarUrl,
        username: app.globalData.username,
        identity: wx.getStorageSync('userInfo').identity
      })
    }
    //用户的openId
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  hideImg() {
    this.setData({
      showImg: false
    })
  },

  addToMyapp(e) {
    this.setData({
      showImg: true
    })
  },

  goMyresume(e) {
    let openid = e.currentTarget.dataset.openid
    wx.navigateTo({
      url: `/pages/resume/resume?openid=` + openid,
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
    if (app.globalData.isLogin) {
      this.setData({
        logged: true,
        userInfo: wx.getStorageSync('userInfo')
      })
    }

    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
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