// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user = db.collection("user")
  let status = parseInt(event.status)
  let result = []
  result = await user.where({
    _openid: wxContext.OPENID
  }).field({
    info_delivery: true
  }).get()
  result = result.data[0].info_delivery
  if (status > 0){
    let res = [];
    for(var i=0;i<result.length;i++){
      if(result[i].status == status){
        res.push(result[i])
      }
    }
    result = res;
  }
  
  return result
}