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
  const infoID = event.infoID
  let flag = event.flag
  let collect = event.collect
  //保存我的简历
  if (flag == "保存简历" && (fileID && typeof (fileID) != "undefined")){
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
  } else if ((fileID && typeof (fileID) != "undefined") && flag == "删除简历"){
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
    }//添加收藏
  } else if (flag == "收藏" && (infoID && typeof (infoID) != "undefined")){
    if(collect){//收藏
      try {
        return await user.where({
          "_openid": wxContext.OPENID
        }).update({
          data: {
            info_collections: _.push([infoID])
          }
        })
      } catch (e) {
        console.error(e)
      }
    }else{//取消收藏
      try {
        return await user.where({
          "_openid": wxContext.OPENID
        }).update({
          data: {
            info_collections: _.pull(infoID)
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }else if (flag=="投递"){
    //开始投递时，状态为0
    
    let info_delivery = { "infoID": infoID, "status": event.status, "send_time": db.serverDate()}
    try {
      await user.where({
        "_openid": wxContext.OPENID
      }).update({
        data: {
          info_delivery: _.push(info_delivery)
        }
      }).then(res => {
        console.log(res)
      })
    } catch (e) {
      console.error(e)
    }
    const send = await cloud.callFunction({
      // 要调用的云函数名称
      name: 'send',
      // 传递给云函数的参数
      data: {
        infoID: infoID,
        fileID: fileID,
        title: event.title
      }
    })
    return send.result
    //修改投递状态
  }else{

  }
  
}