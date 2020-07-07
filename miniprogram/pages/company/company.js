// pages/company/company.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: [],
    readmore: {
      status: false,
      tip: '查看更多'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    wx.cloud.callFunction({
      name: 'search_company',
      data: {
        id: options.id
      }
    }).then(res => {
      console.log(res.result)
      this.setData({
        company: res.result
      })
    })
  },
  toggle() {
    const status = this.data.readmore.status
    this.setData({
      readmore: {
        status: !status,
        tip: status ? '收起' : '查看更多'
      }
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