// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const comment = db.collection('comment')
  const addComment = event.addComment
  try {
    return await comment.add({
      data: {
        "comment_user_id": wxContext.OPENID,
        "avatar": addComment.avatar,
        "create_time": db.serverDate(),
        "content": addComment.content,
        "infoID": addComment.infoID,
        "user_name": addComment.user_name,
        "comment_responses": []
      }
    })
  } catch (e) {
    console.error(e)
  }
  
}