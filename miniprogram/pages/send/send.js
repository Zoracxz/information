// pages/send/send.js
var resource = require("../../utils/resource.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    tabList: [],
    identity: 0,
    resources: [],
    info_delivery: [],
    ids: []
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
    this.fetchData();
  },
  tabSelect(e) {
    this.setData({
      resources: [],
      TabCur: e.currentTarget.dataset.id
    })
    this.fetchData();
  },

  fetchData: function(e){
    var that = this;
    let ids = [];
    wx.cloud.callFunction({
      // 声明调用的函数名
      name: 'search_send',
      data: {
        status: that.data.TabCur
      }
    }).then(res => {
      if (res.result.data.length > 0) {
        let info_delivery = res.result.data[0].info_delivery
        // console.log(info_delivery)
        that.setData({
          info_delivery: info_delivery
        })
        for (var index in info_delivery) {
          let item = info_delivery[index]
          ids.push(item.infoID)
          that.setData({
            ids: ids
          })
        }
        wx.cloud.callFunction({
          name: 'search_info',
          data: {
            ids: that.data.ids
          }
        }).then(res => {
          console.log(res)
          resource.getResource(res.result, that)
        }).catch(err => {
          console.log(err)
        })
      }
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