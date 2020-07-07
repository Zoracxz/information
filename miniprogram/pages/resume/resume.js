// miniprogram/pages/resume/resume.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resumes: [],
    toggleDelay: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var openid = options.openid
    wx.cloud.callFunction({
      name: 'search_user'
    }).then(res => {
      this.setData({
        resumes: res.result
      })
    }).catch(err => {
      console.log(err)
    })
  },
  
  upload_resume: function (e) {
    var that = this;
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
        for(var index in that.data.resumes){
          if (tempFile.name == that.data.resumes[index].title){
            wx.showToast({
              title: "简历名称不能重复",
              icon: 'none',
              duration: 2000
            })
            return null
          }
        }
        wx.cloud.uploadFile({
          cloudPath: 'resumes/' + tempFile.name,
          filePath: tempFile.path,
        }).then(res => {
          console.log(res.fileID)
          var resume = {};
          resume.fileID = res.fileID;
          resume.title = tempFile.name;
          wx.cloud.callFunction({
            name: 'update_user',
            data: {
              title: tempFile.name,
              fileID: res.fileID,
              flag: "保存简历"
            }
          }).then(res => {
            if(res.result.stats.updated==1){
              that.setData({
                resumes: that.data.resumes.concat(resume)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  delete_resume: function(e){
    var fileID = e.currentTarget.dataset.fileid
    var index = e.currentTarget.dataset.index
    var that = this;
    wx:wx.showModal({
      content: '确定要删除该简历吗',
      showCancel: true,
      success: function(res) {
        if (res.confirm){
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: 'update_user',
            data: {
              fileID: fileID,
              flag: "删除简历"
            }
          }).then(res => {
            // wx.cloud.deleteFile({
            //   fileList: [fileID]
            // }).then(res => {
            //   // handle success
            //   console.log(res.fileList)
            // }).catch(error => {
            //   // handle error
            //   console.log(err)
            // })
          }).catch(err => {
            console.log(err)
          })
          wx.hideLoading();
          var resumes = that.data.resumes;
          resumes.splice(index, 1);
          that.setData({
            resumes: resumes
          })
        }
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