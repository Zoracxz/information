// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    title: "",
    infoID: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title
    let infoID = options.infoID
    this.setData({
      title: title,
      infoID: infoID
    })
    wx.cloud.callFunction({
      name: 'search_comment',
      data: {
        infoID: infoID
      }
    }).then(res => {
      console.log(res)
      let commentList = res.result.data;
      commentList.forEach((element, index) => {
        let create_time = element.create_time.match(/^[0-9]*-[0-9]*-[0-9]*/)[0]
        commentList[index].create_time = create_time;
        if (element.comment_responses.length > 0) {
          element.comment_responses.forEach((ele, indexReply) => {
            let r_create_time = ele.create_time.match(/^[0-9]*-[0-9]*-[0-9]*/)[0];
            commentList[index].comment_responses[indexReply].create_time = r_create_time;
          })
        }
      })
      console.log(commentList)
      this.setData({
        commentList: commentList
      })
    })
    
  },
  goComment(e){
    let uriData = {
      avatar: wx.getStorageSync('avatarUrl'),
      user_name: wx.getStorageSync('username'),
      infoid: this.data.infoID,
      title: this.data.title
    };
    wx.navigateTo({ url: `/components/comment/submit/index?uriData=${encodeURIComponent(JSON.stringify(uriData))}` });
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