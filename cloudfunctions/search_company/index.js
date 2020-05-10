// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const company = db.collection("company")
  let id = event.id
  let hr_id = event.hr_id
  let result = []
  if (id && typeof (id) != "undefined"){
    await company.doc(id).get().then(res => {
      console.log(res.data)
      result.push(res.data)
    }).catch(err => {
      console.log(err)
    })
  } else if (hr_id && typeof (hr_id) != "undefined"){
    await company.where({
      hr_ids: _.in([hr_id])
    }).get().then(res => {
      result = res.data
    })
  }
  return result
}