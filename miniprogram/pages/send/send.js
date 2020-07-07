// pages/send/send.js
var resource = require("../../utils/resource.js")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    v_TabCur:0,
    MainCur: 0,
    tabList: [],
    Index: 1,
    resources: [],
    info_delivery: [],
    ids: [],
    VerticalNavTop: 0,
    list: [],
    load: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.manage){
      this.setData({
        tabList: [
          "下载简历",  
          "录用",
          "拒绝"
        ],
        Index: 3,
      })
      this.manage();
    }else{
      this.setData({
        tabList: [
          "已投递",
          "被查看",
          "已通过",
          "不合适"
        ],
        Index: 1,
      })
      this.fetchData();
    }
  },
  tabSelect(e) {
    this.setData({
      resources: [],
      list: [],
      TabCur: e.currentTarget.dataset.id
    })
    if(this.data.Index==1){
      this.fetchData();
    }else{
      this.manage();
    }
  },
  v_tabSelect(e) {
    this.setData({
      v_TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
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
      console.log(res)
      if (res.result.length > 0) {
        let info_delivery = res.result
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
  manage: function(e){
    let list = [{}];
    wx.cloud.callFunction({
      name: 'search_info',
      data: {
        manage: true
      }
    }).then(res => {
      console.log(res)
      let data = res.result.data
      for (let i = 0; i < data.length; i++) {
        list[i] = {};
        list[i].name = data[i].title;
        list[i].id = i;
        list[i].resumes = data[i].resumes;
        list[i].infoID = data[i]._id;
      }
      this.setData({
        list: list,
        listCur: list[0]
      })
    }).catch(err => {
      console.log(err)
    })
    // if(this.data.TabCur == 1){
    //   wx.cloud.callFunction({
    //     name: 'search_info',
    //     data: {
    //       status: this.data.TabCur+1,
    //     }
    //   })
    // }
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  update_resume: function (e) {
    var fileID = e.currentTarget.dataset.fileid
    var title = e.currentTarget.dataset.title
    var status = e.currentTarget.dataset.status
    var that = this;
    console.log(this.data.list[this.data.v_TabCur].infoID)
    console.log(fileID)
    console.log(status)
    wx.cloud.callFunction({
      name: 'search_user',
      data: {
        update: true,
        fileID: fileID,
        infoID: this.data.list[this.data.v_TabCur].infoID,
        status: status,
      }
    }).then(res => {
      console.log(res)
      if(res.result == 0){
        if(status > 1){
          wx.showToast({
            title: '已操作',
            icon: 'none',
            duration: 1500
          })
        }
      }else{
        if (status == 2) {
          wx.showToast({
            title: '已录用',
            icon: 'success',
            duration: 2000
          })
        } else if (status == 3) {
          wx.showToast({
            title: '已拒绝',
            icon: 'success',
            duration: 2000
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
    if (status == 1) {
      wx.cloud.downloadFile({
        fileID: fileID
      }).then(res => {
        // get temp file path
        console.log(res)
        if (res.statusCode == 200) {
          wx.getFileSystemManager().saveFile({
            tempFilePath: res.tempFilePath, // 传入一个本地临时文件路径, http://tmp/开头的
            filePath: wx.env.USER_DATA_PATH + '/' + title, //保存到用户目录/title文件中，此处文件名自定义，因为tempFilePath对应的是一大长串字符
            success(res) {
              console.log('save ->', res) // res.savedFilePath 为一个本地缓存文件路径
              wx.showToast({
                title: '文件已保存至：' + res.savedFilePath,
                icon: 'none',
                duration: 1500
              })
            }
          })
        }
        // console.log(this.data.list[this.data.v_TabCur].infoID)
      }).catch(error => {
        // handle error
        console.log(error)
      })
    }
    
  },
  receive_resume: function(e){

  },
  reject_resume:function(e){

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