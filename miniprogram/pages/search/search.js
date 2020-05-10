// pages/search/search.js

var resource = require("../../utils/resource.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resources: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'searched',
      success: function(res) {
        var data = res.data;
        that.setData({
          histories: data
        })
      },
    })
  },
  onHistoryInputEvent: function(e){
    var that = this;
    var title = e.detail.title;
    //存入历史记录
    var isExisted = false;
    var histories = that.data.histories;
    if (histories) {
      for (var index = 0; index <= histories.length; index++) {
        var info = histories[index];
        if (info.title === title) {
          isExisted = true;
          break;
        }
      }
    }
    if (!isExisted) {
      if (!histories) {
        histories = [];
      }
      histories.push({ title: title });
      wx.setStorage({
        key: 'searched',
        data: histories,
        success: function () {
          console.log("保存成功！");
        }
      })
    }
  },
  onSearchInputEvent: function(e){
    var that = this;
    var value = e.detail.result;
    that.setData({
      resources: []
    });
    // if(!value || value === ''){
    //   that.setData({
    //     resources: []
    //   });
    //   return;
    // }
    //根据搜索框中的关键字获取信息
    resource.getResource(value, that)
    console.log(that.data.resources)
  },
  onClearEvent: function(e){
    wx.removeStorage({
      key: 'searched',
      success: function(res) {
        console.log("删除成功")
      },
    });
    this.setData({
      histories: null
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