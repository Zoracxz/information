// pages/content/content.js

// import { resource } from "../../utils/resource.js";
var resource = require("../../utils/resource.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    resources: [],
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      id: options.id,
      resources: []
    })
   this.fetch_info();
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

  },
  // 获取资源信息
  fetch_info: function (){
    var that = this;
    wx.cloud.callFunction({
      name: 'search_info',
      data: {
        type: this.data.id
      },
    }).then(res => {
      resource.getResource(res.result,that)
    }).catch(console.error)
  }
})