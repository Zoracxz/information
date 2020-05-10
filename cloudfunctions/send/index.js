// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let infoID = event.infoID
  let fileID = event.fileID
  const res = await cloud.callFunction({
    name: 'search_info',
    data: {
      ids: [infoID]
    }
  })
  let result = res.result[0]
  //投递简历
  if(result != null && typeof(result) != 'undefined'){
    let date = new Date()
    let deadline = new Date(result.deadline)
    if (date.getTime() <= deadline.getTime() && result.has_r_numbers < result.r_numbers) {//转换成毫秒进行比较,在截至日期之前
      console.log("fdaf")
      const user = await cloud.callFunction({
        name: 'update_info',
        data: {
          infoID: infoID,
          fileID: fileID,
          title: event.title
        }
      })
      return user.result
      
    } 
  }
}