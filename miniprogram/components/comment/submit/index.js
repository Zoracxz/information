// components/comment/submit/index.js


const app = getApp();
Component({
  /**
   * 引入外部样式
   */
  externalClasses: ['extra-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: "",
    globalData: "", //全局数据
    title: "",//默认标题
    image: "", //默认头像
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
       * 生命周期函数--监听页面加载
       */
    onLoad: async function (options) {
      let self = this;
      let { avatar, infoid, title, user_name, replyName, replyid } = JSON.parse(decodeURIComponent(options.uriData));
      self.setData({
        avatar,
        infoid,
        title,
        user_name,
        replyid: replyid ? replyid : "",
        replyName: replyName ? ("@" + replyName + "： ") : "",
      });
      //console.log(app.globalData)
    },
    textareaCtrl: function (e) {
      if (e.detail.value) {
        this.setData({
          content: e.detail.value
        })
      } else {
        this.setData({
          content: ""
        })
      }
    },
    /**
     * 提交数据
     */
    commentSubmit: async function () {
      let self = this;
      let { avatar, infoid, content, user_name, replyid } = this.data;
      if (content) {
        let addComment = {};
        addComment.avatar = avatar;
        if (infoid && typeof (infoid) != "undefined"){
          addComment.infoID = infoid;
        }
        addComment.content = content;
        addComment.user_name = user_name;
        console.log(addComment)
        if (replyid == "") {
          console.log(replyid)
          wx.cloud.callFunction({
            name: 'add_comment',
            data: {
              addComment: addComment
            }
          }).then(res => {
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  self.submitLock = false;
                  wx.navigateBack();
                  app.globalData.commentRefresh = true;
                }, 2000)
              }
            })
          })
        }else{
          addComment.replyId = replyid;
          console.log(addComment)
          wx.cloud.callFunction({
            name: 'update_comment',
            data: {
              addComment: addComment
            }
          }).then(res => {
            wx.showToast({
              title: '回复成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  self.submitLock = false;
                  wx.navigateBack();
                  app.globalData.commentRefresh = true;
                }, 2000)
              }
            })
          })
        }

        
      } else {
        util.showToast('请填写内容！', "fail");
      }
    }
  }
})
