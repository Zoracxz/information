// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const informations = db.collection('informations')
  const _ = db.command
  const fileID = event.fileID
  const infoID = event.infoID
  const title = event.title
  let refresh = event.refresh
  let information = event.information
  let flag = event.flag
  let result = []
  //自增浏览量
  if (refresh && typeof (infoID) != "undefined"){
    await informations.doc(infoID).update({
      data: {
        hot: _.inc(1)
      },
    }).then(res => {
      // console.log(res.data)
      result = res
    })
  } else if (fileID && typeof (fileID) != "undefined" && infoID && typeof (infoID) != "undefined"){
    let resume = { "title": title, "fileID": fileID }
    //如果录用成功，记得将info的has_r_numbers加1
    await informations.doc(infoID).update({
      data: {
        resumes: _.push(resume)
      },
    }).then(res => {
      // console.log(res.data)
      result = res
    })
  } else if (information && typeof (information) != "undefined"){
    await informations.doc(infoID).update({
      data: {
        "update_time": db.serverDate(),
        "deadline": new Date(information.deadline),
        "salary": information.salary,
        "title": information.title,
        "education": information.education,
        "welfare": information.welfare,
        "tags": information.tags,
        "introduction": information.introduction,
        "location": information.location
      },
    }).then(res => {
      // console.log(res.data)
      result = res
    })
  } else if ((infoID && typeof (infoID) != "undefined") && flag == "删除信息") {
    try {
      return await informations.doc(infoID).remove()
    } catch (e) {
      console.error(e)
    }//添加收藏
  }
  return result
}