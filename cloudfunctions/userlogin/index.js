// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
//数据库指令
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let openid = event.openid;
  let userInfos = event.userInfos
  let loginStatue = "wait";
  let newSatatue = "no-instruction";
  let queryResult = []

  await db.collection('user').where({
    _openid: _.eq(openid),
  }).get().then(res => {
    loginStatue = "success";
    queryResult = res.data;
    test = res.data.result.username;
  }).catch(err => {
    // loginStatue = "fail"
  })



  //当查询不到这个openid的用户时，说明用户不存在。这个时候就需要插入这个用户
  if (queryResult.length == 0) {
    
    await cloud.callFunction({
      name: 'add_user',
      data: {
        userInfos: userInfos
      }
    }).then(res => {
      newSatatue = 'insert';
    }).catch(err => {
      newSatatue = 'err'
    })
  }

  return {
    loginStatue,
    newSatatue,
    queryResult,
  }

}