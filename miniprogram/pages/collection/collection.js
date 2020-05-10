// pages/collection/collection.js
var resource = require("../../utils/resource.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resources: [],
    toggleDelay: true,
  },

  toDetail(e) {
    let item = JSON.stringify(e.currentTarget.dataset.item);
    item = encodeURIComponent(item)
    wx.navigateTo({
      url: "/pages/detail/detail?item=" + item,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'search_user',
      data: {
        collection: true
      }
    }).then(res => {
      console.log(res.result)
      wx.cloud.callFunction({
        name: 'search_info',
        data: {
          ids: res.result
        }
      }).then(res => {
        let resources = resource.getResource(res.result, that)
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
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