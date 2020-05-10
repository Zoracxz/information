// pages/release/release.js
var resource = require("../../utils/resource.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ['实习', '兼职', '培训', '活动', '赛事', '其它'],
    education: ['专科', '本科', '研究生'],
    tags: [{
      name: 'J2EE',
      selected: false
      },{
      name: 'JAVA',
      selected: false
      }, {
        name: 'PYTHON',
        selected: false
      }, {
        name: '计算机',
        selected: false
      }, {
        name: '设计',
        selected: false
      }],
    date: '2020-3-25',
    region: ['湖南省', '长沙市', '开福区'],
    index: null,
    idx: null,
    modalName: null,
    textareaBValue: '',
    information: {},
    resources: [],
    toggleDelay: true,
  },
  tagsChange(e) {
    var index = e.currentTarget.dataset.index
    this.data.tags[index].selected = !this.data.tags[index].selected
    this.setData({
      tags: this.data.tags
    })
  },
  addTag(e) {
    console.log(e)
    var name = e.detail.value
    var tag = {}
    tag.name = name
    tag.selected = true
    this.setData({
      tags: this.data.tags.concat(tag)
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  TargeChange(e) {
    console.log(e);
    this.setData({
      idx: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  release: function(e){
    var that = this;
    console.log(e)
    var value = e.detail.value
    var type = parseInt(value.type)
    var r_numbers = parseInt(value.r_numbers)
    var information = {};
    information.title = value.title
    information.education = this.data.education[value.education]
    information.welfare = value.welfare
    information.frequency = value.frequency
    information.r_numbers = r_numbers
    information.location = value.location[1]
    information.introduction = value.introduction
    information.salary = value.salary
    information.type = type
    information.deadline = value.deadline
    var tags = [];
    for(var index in this.data.tags){
      if(this.data.tags[index].selected){
        tags.push(this.data.tags[index].name)
      }
    }
    information.tags = tags
    wx.cloud.callFunction({
      name: 'add_info',
      data: {
        information: information
      }
    }).then(res => {
      wx.showToast({
        title: '发布成功',
        duration: 1000,
        mask: true,
        success: function(res) {
          that.hideModal()
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'search_info',
      data: {
        release: true
      }
    }).then(res => {
      console.log(res)
      let resources = resource.getResource(res.result, that)
    }).catch(err => {
      console.log(err)
    })
  },
  toDetail(e) {
    let item = JSON.stringify(e.currentTarget.dataset.item);
    item = encodeURIComponent(item)
    wx.navigateTo({
      url: "/pages/detail/detail?flag=update&item=" + item,
    });
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