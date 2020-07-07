import { RecommendinfosService } from '../../utils/index.js'
var resource = require("../../utils/resource.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexmenu: [],
    identity: 0,
    cardCur: 0,
    swiperList: [],
    recommend_result: [],
    resources: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData();
    if(wx.getStorageSync('userInfo')){
      this.setData({
        identity: wx.getStorageSync('userInfo').identity
      })
    }
    // 初始化towerSwiper 传已有的数组名即可
    this.towerSwiper('swiperList');

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
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        identity: wx.getStorageSync('userInfo').identity
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
    
  },
  fetchData: function () {
    var that = this
    that.setData({
      indexmenu: [
        {
          'id': 0,
          'text': '招聘',
          'url': 'zhaopin'
        },
        {
          'id': 1,
          'text': '兼职',
          'url': 'jianzhi'
        },
        {
          'id': 2,
          'text': '培训',
          'url': 'peixun'
        },
        {
          'id': 3,
          'text': '活动',
          'url': 'huodong'
        },
        {
          'id': 4,
          'text': '赛事',
          'url': 'saishi'
        },
        {
          'id': 5,
          'text': '其他',
          'url': 'qita'
        }
      ],
      swiperList: [{
        id: 0,
        type: 'image',
        url: 'https://img.mp.sohu.com/upload/20170807/24da8bb77cd9432e8d3e07779e7c0c2d_th.png'
      }, {
        id: 1,
        type: 'image',
          url: 'https://img.51miz.com/preview/video/00/00/11/07/V-110749-5D4E6691.jpg',
      }, {
        id: 2,
        type: 'image',
          url: 'https://img0.sc115.com/uploads3/sc/psd/191118/1911181424500.jpg'
      }, {
        id: 3,
        type: 'image',
          url: 'https://puui.qpic.cn/qqvideo_ori/0/b0777es1ork_496_280/0'
      }]
    })
    wx.cloud.callFunction({
      name: 'search_user',
      data: {
        recommend: true
      }
    }).then(res => {
      var result = res.result
      var data = [];
      for (var index in result){
        if (result[index].info_delivery.length != 0){
          var info_delivery = result[index].info_delivery
          for (var i = 0; i < info_delivery.length; ++i){
            var item = {};
            item.userId = result[index]._id
            item.infosId = info_delivery[i].infoID
            data.push(item)
          }
        }
      }
      // console.log(data)
      var userId = wx.getStorageSync('userInfo')._id
      var n = 3
      const recommendinfosService = new RecommendinfosService(data, userId, n)
      const recommend_result = recommendinfosService.start()
      // console.log(recommend_result)
      wx.cloud.callFunction({
        name: 'search_info',
        data: {
          ids: recommend_result
        }
      }).then(res => {
        // console.log(res)
        resource.getResource(res.result, that)
      }).catch(err => {
        console.log(err)
      })
      
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  enterCompany(){
    wx.navigateTo({
      url: `/pages/addCompany/addCompany`,
    })
  }
})