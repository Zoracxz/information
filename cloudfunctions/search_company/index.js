// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const company = db.collection("company")
  let id = event.id
  let result = []
  if (id && typeof (id) != "undefined"){
    await company.doc(id).get().then(res => {
      console.log(res.data)
      result.push(res.data)
    }).catch(err => {
      console.log(err)
    })
  }
  return result
}