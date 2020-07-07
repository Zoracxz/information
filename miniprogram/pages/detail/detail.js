// miniprogram/pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    userInfo: {},
    myInfo:{},
    avatarUrl: '../my/user-unlogin.png',
    readmore: {
      status: false,
      tip: '查看更多'
    },
    collect: {
      status: false,
      tip: '收藏'
    },
    show: false,
    resumes: [],
    selected: {
      fileID: "",
      title: ""
    },
    send: "立即投递",
    flag: "",
    animation: "",
    modalName: null,
    education: ['专科', '本科', '研究生'],
    tags: [{
      name: 'J2EE',
      selected: false
    }, {
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
    region: ['湖南省', '长沙市', '开福区'],
    idx: null,
    textareaBValue: '',
    date: '2020-6-25',
    CustomBar: app.globalData.CustomBar,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let flag = options.flag
    let item = decodeURIComponent(options.item)
    if (typeof (item) != "string") {
      console.log('去除回车换行空格失败！参数不是字符串类型')
      return;
    }
    item = item.replace(/\ +/g, "");//去掉空格
    item = item.replace(/[\r\n]/g, "");//去掉回车换行
    let info = JSON.parse(item);
    this.setData({
      info: info,
      flag: flag
    })
    wx.cloud.callFunction({
      name: 'update_info',
      data: {
        infoID: info.id,
        refresh: true
      }
    }).then(res => {
      if(res.result.stats.updated > 0 ){
        this.setData({
          'info.hot': this.data.info.hot + 1
        })
      }
    })
    let hr_id = info.hr_id;
    console.log(this.data.info)
    wx.cloud.callFunction({
      name: 'search_user',
      data: {
        hr_id: hr_id
      }
    }).then(res => {
      let userInfo = res.result[0];
      this.setData({
        userInfo: userInfo,
        avatarUrl: userInfo.avatar
      })
    })
    wx.cloud.callFunction({
      name: 'search_user',
      data: {
        collection: true
      }
    }).then(res => {
      console.log(res)
      let info_collections = res.result;
      if (info_collections.indexOf(info.id) != -1) {
        this.setData({
          collect: {
            status: true,
            tip: '已收藏'
          }
        })
      }
    })
    wx.cloud.callFunction({
      name: 'search_user',
      data: {
        send: true
      }
    }).then(res => {
      console.log(res)
      let info_delivery = res.result;
      for(var index in info_delivery){
        let item = info_delivery[index]
        if(item.infoID == info.id){
          this.setData({
            send: "已投递"
          })
          break;
        }
      }
    })
  },
  update: function (e){
    var that = this;
    console.log(e)
    var value = e.detail.value
    var information = {};
    information.title = value.title
    information.education = this.data.education[value.education]
    information.welfare = value.welfare
    information.location = value.location[1]
    information.introduction = value.introduction
    information.salary = value.salary
    information.deadline = value.deadline
    var tags = [];
    for (var index in this.data.tags) {
      if (this.data.tags[index].selected) {
        tags.push(this.data.tags[index].name)
      }
    }
    information.tags = tags
    wx.cloud.callFunction({
      name: 'update_info',
      data: {
        infoID: this.data.info.id,
        information: information
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '更新成功',
        duration: 1000,
        mask: true,
        success: function (res) {
          that.hideInfoModal()
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }).catch(err => {
      console.log(err)
    })
  },
  updateInfo: function(e) {
    this.fade("update")
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  deleteInfo: function () {
    let that = this
    wx: wx.showModal({
      content: '确定要删除当前信息吗',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: 'update_info',
            data: {
              infoID: that.data.info.id,
              flag: "删除信息"
            }
          }).then(res => {
            wx.hideLoading();
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })

  },
  fade(e) {
    var anmiaton = e
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function () {
      that.setData({
        animation: ''
      })
    }, 1000)
  },
  showModal: function() {
    if (this.data.send == '已投递') {
      return
    }
    this.setData({
      show: true
    })
    wx.cloud.callFunction({
      name: 'search_user'
    }).then(res => {
      if(res.result.length == 0){
        wx.showToast({
          title: '您还没有可投递简历，请先上传简历',
          icon: 'none',
          success: function(e){
            wx.navigateTo({
              url: "/pages/resume/resume",
            })
          }
        })
      }
      this.setData({
        resumes: res.result
      })
    }).catch(err => {
      console.log(err)
    })
  },
  change(e){
    let result = e.detail.value.split(",")
    let title = result[0]
    let fileID = result[1]
    console.log(result)
    this.setData({
      'selected.fileID': fileID,
      'selected.title': title,
    })
  },
  send(){
    let infoID = this.data.info.id
    let fileID = this.data.selected.fileID
    let title = this.data.selected.title
    wx.cloud.callFunction({
      name: 'update_user',
      data:{
        infoID: infoID,
        fileID: fileID,
        status: 0,
        title: title,
        flag: "投递",
      }
    }).then(res => {
      if (res.result.stats.updated > 0){
        this.hideModal()
        wx.showToast({
          title: '已成功投递',
          icon: 'success',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  hideModal(e) {
    this.setData({
      show: false
    })
  },
  hideInfoModal(e) {
    this.setData({
      modalName: null
    })
  },
  toCompany: function(e){
    wx.navigateTo({
      url: "/pages/company/company?id=" + this.data.info.c_id,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = wx.createSelectorQuery()
    let self = this
    query.select(".contents").boundingClientRect(function (res) {
      const lineHeight = 18
      const height = res.height
      const status = "readmore.status"
      self.setData({
        [status]: height / lineHeight > 3
      })
    }).exec()
  },
  collection(){
    const status = this.data.collect.status
    let id = this.data.info.id;
    if (!this.data.collect.status){
      wx.cloud.callFunction({
        name: "update_user",
        data: {
          infoID: id,
          collect: true,
          flag: "收藏"
        },
      }).then(res => {
        console.log(res.result)
      }).catch(console.error)
    }else{
      wx.cloud.callFunction({
        name: "update_user",
        data: {
          infoID: id,
          collect: false,
          flag: "收藏"
        },
      }).then(res => {
        console.log(res.result)
      }).catch(console.error)
    }
    this.setData({
      collect: {
        status: !status,
        tip: status ? '收藏' : '已收藏'
      }
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
  goComment: function(e){
    let infoID = this.data.info.id
    let title = this.data.info.title
    wx.navigateTo({
      url: `/pages/comment/comment?infoID=` + infoID + `&title=` + title,
    })
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