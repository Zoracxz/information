// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
//保存我的简历
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user = db.collection('user')
  const fileID = event.fileID
  try {
    return await user.where({
      "_openid": wxContext.OPENID
    }).update({
      data: {
        r_delivery: _.push(r_delivery)
      }
    })
  } catch (e) {
    console.error(e)
  }
}