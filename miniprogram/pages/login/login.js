// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
    // 查看是否授权
    console.log('进入用户页检查是否登录:', app.globalData.isLogin)
    console.log('是否已授权：', wx.getStorageSync('isLogin'))
    console.log('是否已有用户openId：', app.globalData.openid)
  },
  cloudLogin(userInfo) {
    //调用login时就直接调用云函数即可
    wx.showLoading({
      title: '登录中...'
    });
    wx.cloud.callFunction({
      // 声明调用的函数名
      name: 'userlogin',
      // data里面存放的数据可以传递给云函数的event  效果：event.a = 1
      data: {
        userInfos: userInfo,
        openid: this.data.openid
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading({})
      if (res.result.loginStatue === 'success') {
        wx.setStorageSync('isLogin', 'isLogin')
        app.globalData.isLogin = wx.getStorageSync('isLogin')
        wx.setStorageSync('userInfo', res.result.queryResult[0])
        wx.reLaunch({
          url: '../my/my'
        })
      }
    }).catch(err => {
      console.log(err)
    })

  },
  getOpenId() {
    wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      // console.log(res.result.openid)
      let openid = res.result.openid
      app.globalData.openid = openid
      console.log(res)
      this.setData({
        openid,
      })
    }).catch(err => {
      console.log(err)
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    if (!e.detail.userInfo) {
      wx.showToast({
        title: "you reject it!",
        icon: 'none',
        duration: 1000
      })
      return;
    }
    let userInfo = e.detail.userInfo
    wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
    wx.setStorageSync('username', userInfo.nickName)
    app.globalData.avatarUrl = userInfo.avatarUrl
    app.globalData.username = userInfo.nickName
    this.cloudLogin(userInfo);
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