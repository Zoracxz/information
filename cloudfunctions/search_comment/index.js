// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const comment = db.collection("comment")
  let result = []
  let infoID = event.infoID
  if (infoID && typeof (infoID) != "undefined"){
    result = await comment.where({
      infoID: infoID
    }).get()
  }
  return result
}