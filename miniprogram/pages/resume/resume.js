// miniprogram/pages/resume/resume.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      openid: options.openid
    })
  },
  upload_resume: function (e) {
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFile = res.tempFiles[0]
        console.log(tempFile)
        if (typeof (tempFile) == 'undefined'){
          wx.showToast({
            title: "文件上传失败，请确定是否本地存在该文件",
            icon: 'none',
            duration: 2000
          })
          return null
        }
        wx.cloud.uploadFile({
          cloudPath: 'resumes/' + tempFile.name,
          filePath: tempFile.path,
        }).then(res => {
          console.log(res.fileID)
          wx.cloud.callFunction({
            name: 'update_user',
            data: {
              title: tempFile.name,
              fileID: res.fileID
            }
          }).then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      }
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