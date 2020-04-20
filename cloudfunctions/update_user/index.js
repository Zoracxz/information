// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user = db.collection('user')
  const _ = db.command
  const fileID = event.fileID
  let remove = event.remove
  //保存我的简历
  if (typeof (remove) == "undefined" && (fileID || typeof (fileID) != "undefined")){
    let resumes = { "title": event.title, "fileID": fileID}
    try {
      return await user.where({
        "_openid": wxContext.OPENID
      }).update({
        data: {
          resumes: _.push(resumes)
        }
      })
    } catch (e) {
      console.error(e)
    }//删除某个简历
  } else if ((fileID || typeof (fileID) != "undefined") && remove){
    try {
      return await user.where({
        "_openid": wxContext.OPENID
      }).update({
        data: {
          resumes: _.pull({
            fileID: fileID
          })
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  
  else{
    //开始投递时，状态为0
    let r_delivery = { "id": event.r_id, "status": event.status, "resume_id": event.resume_id }
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
  
}