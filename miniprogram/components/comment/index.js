// components/comment/index.js
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
    commentList: {
      type: Array,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击评论
     * @param {string} e 获取当前数据
     */
    _goToReply(e) {
      let self = this;
      let { contentid, battleTag, replyid, title  } = e.currentTarget.dataset;
      console.log(e.currentTarget.dataset);
      wx.showActionSheet({
        itemList: ['回复'],
        success: function (res) {
          if (!res.cancel) {
            console.log(res.tapIndex);
            //前往评论 
            if (res.tapIndex == 0) {
              //判断是否是 评论的评论
              self._goToComment(replyid, battleTag, title);
            }
          } else {  //取消选择

          }
        }
      });
    },
    /**
         * 跳转去评论
         */
    _goToComment(replyid, replyName, title) {
      let uriData = {
        avatar: wx.getStorageSync('avatarUrl'),
        title: title,
        user_name: wx.getStorageSync('username'),
        replyid: replyid,
        replyName: replyName
      };
      wx.navigateTo({ url: `/components/comment/submit/index?uriData=${encodeURIComponent(JSON.stringify(uriData))}` });
    },
  }
})
