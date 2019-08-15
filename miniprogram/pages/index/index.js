Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexmenu: [],
    identity: 0,
    cardCur: 0,
    swiperList: [],
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
    this.setData({
      indexmenu: [
        {
          'text': '招聘',
          'url': 'zhaopin'
        },
        {
          'text': '兼职',
          'url': 'jianzhi'
        },
        {
          'text': '培训',
          'url': 'peixun'
        },
        {
          'text': '活动',
          'url': 'huodong'
        },
        {
          'text': '赛事',
          'url': 'saishi'
        },
        {
          'text': '其他',
          'url': 'qita'
        }
      ],
      swiperList: [{
        id: 0,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
      }, {
        id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
      }, {
        id: 2,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
      }, {
        id: 3,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
      }, {
        id: 4,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
      }, {
        id: 5,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
      }, {
        id: 6,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
      }]
    })
  },
  add_user: function(res) {
    console.log(res.detail.userInfo)
    var userInfos = res.detail.userInfo
    // wx.cloud.callFunction({
    //   name: "add_user",
    //   data: {
    //     userInfos: userInfos,
    //     introduction: "test",
    //   },
    // }).then(res => {
    //   console.log(res.result)
    // }).catch(console.error)
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
  }
  
})