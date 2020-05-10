// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user = db.collection("user")
  let status = event.status
  let result = []
  if (status == 0){
    result = await user.where({
      _openid: wxContext.OPENID
    }).field({
      info_delivery: true
    }).get()
  }else{
    try {
      result = await user.where({
        _openid: wxContext.OPENID,
        info_delivery: {
          status: status
        }
      }).get()
    } catch (e) {
      console.log(e)
    }
  }
  
  return result
}