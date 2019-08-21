// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const user = db.collection("user")
  let _openid = event._openid
  let status = event.status
  let result = []

  try {
    return await user.where({
      _openid: _openid
    }).field({
      r_delivery: true
    }).get()
  } catch(e){
    console.log(e)
  }
}