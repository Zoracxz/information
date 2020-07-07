// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const user = db.collection('user')
  let hr_id = event.hr_id //查询条件
  let collection = event.collection
  let recommend = event.recommend
  let send = event.send
  let update = event.update
  let fileID = event.fileID
  let infoID = event.infoID
  let status = parseInt(event.status)
  let result = []
  //根据条件查找user
  if (hr_id != null && typeof (hr_id) != "undefined"){
    try{
      await user.where({
        _openid: hr_id
      }).get().then(res => {
        //console.log(res.data)
        result=res.data
      })
    } catch (e) {
      console.log(e)
    }
  } //根据某个info中有哪些人投递了简历（身份为1以上的人方可查看）
  //查找收藏
  else if (collection && typeof (collection) != "undefined"){
    await user.where({
      _openid: wxContext.OPENID
    }).get().then(res => {
      // console.log(res.data)
      result = res.data[0].info_collections
    })
  }
  //查找投递
  else if (send && typeof (send) != "undefined") {
    await user.where({
      _openid: wxContext.OPENID
    }).get().then(res => {
      // console.log(res.data)
      result = res.data[0].info_delivery
    })
    //智能推荐
  } else if (recommend && typeof (recommend) != "undefined"){
    await user.where({
      info_delivery: _.exists(true)
    }).field({
      _id: true,
      info_delivery: true,
    }).get().then(res => {
      // console.log(res.data)
      result = res.data
    })//已查看简历
  } else if (update != null && typeof (update) != "undefined") {
    flag = false;
    await user.where({
      resumes: _.all([_.elemMatch({
        fileID: fileID
      })]),
      info_delivery: _.elemMatch({
        infoID: infoID,
        status: _.lt(status)
      })
    }).get().then(res=>{
      console.log(res.data.length)
      if(res.data.length == 0){
        flag = true
      }
    })
    if(flag){
      return 0
    }
    try {
      await user.where({
        resumes: _.all([_.elemMatch({
          fileID: fileID
        })]),
        // info_delivery: _.elemMatch({
        //   infoID: infoID,
        //   status: _.lt(status)
        // })
        'info_delivery.infoID': infoID
      }).update({
        data: {
          'info_delivery.$.status': status,
          'info_delivery.$.update_time': db.serverDate()
        },
      }).then(res => {
        console.log(res)
        result=res
      })
    } catch (e) {
      console.log(e)
    }
  }
  //录用/拒绝
  // else if (status != null && typeof (status) != "undefined"){
  //   try {
  //     await user.where({
  //       'info_delivery.status': status,
  //     }).field({
  //       info_delivery: true,
  //       resumes: true
  //     }).get().then(res => {
  //       result = res.data[0]
  //       resumes = res.data[0].resumes
  //       console.log(res)
  //       if (status > 0) {
  //         let res = [];
  //         for (var i = 0; i < result.length; i++) {
  //           if (result[i].status == status) {
  //             res.push(result[i])
  //           }
  //         }
  //         result = res;
  //       }
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  //查找所有简历
  else{
    await user.where({
      _openid: wxContext.OPENID
    }).get().then(res => {
      result = res.data[0].resumes
    }).catch(err => {
      console.error(err)
    })
  }
  return result
}