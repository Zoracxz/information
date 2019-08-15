// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let r_id = event.r_id
  const res = await cloud.callFunction({
    name: 'search_info',
    data: {
      r_id: r_id
    }
  })
  let result = res.result[0]
  //投递简历
  if(result != null && typeof(result) != 'undefined'){
    let date = new Date()
    let deadline = new Date(result.deadline)
    var suc = 0
    if (date.getTime() <= deadline.getTime() && result.has_r_numbers < result.r_numbers) {//转换成毫秒进行比较,在截至日期之前
      const user = await cloud.callFunction({
        name: 'update_user',
        data: {
          r_id: r_id,
          status: 0
        }
      })
      suc = user.result.stats.updated
      //如果录用成功，记得将info的has_r_numbers加1
    } 
  }
  if (suc == 1){
    return "添加成功"
  }else{
    return "添加失败"
  }
}