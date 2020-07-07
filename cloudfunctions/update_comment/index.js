// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const comment = db.collection('comment')
  const _ = db.command
  const addComment = event.addComment
  let id = new Date().toLocaleDateString()+"name:"+addComment.user_name;
  addComment._id = id;
  addComment.create_time = new Date();
  console.log(addComment)
  let result = []
  await comment.doc(addComment.replyId).update({
    data: {
      comment_responses: _.push(addComment)
    },
  }).then(res => {
    // console.log(res.data)
    result = res
  })
  return result
}