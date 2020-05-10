// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const info = db.collection('informations')
  const information = event.information
  try {
    return await info.add({
      data: {
        "hr_id": wxContext.OPENID,
        "r_numbers": information.r_numbers,
        "type": information.type,
        "release_time": db.serverDate(),
        "deadline": new Date(information.deadline),
        "salary": information.salary,
        "title": information.title,
        "education": information.education,
        "welfare": information.welfare,
        "tags": information.tags,
        "frequency": information.frequency,
        "introduction": information.introduction,
        "location": information.location,
        "hot": 0,
        "has_r_numbers": 0,
      }
    })
  } catch (e) {
    console.error(e)
  }
}