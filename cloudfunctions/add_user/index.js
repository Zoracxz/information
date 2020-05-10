// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const userInfos = event.userInfos
  const user = db.collection('user')
  let introduction = event.introduction ? event.introduction : "主人很懒，什么都没留下"
  //添加user,默认为普通用户
  var has = user.doc(wxContext.OPENID).get()
  if (has == null || JSON.stringify(has) !== '{}'){
    return {
      result: false,
      has: has,
      userInfos: userInfos
    }
  }
  try {
    return await user.add({
      data: {
        user_name: userInfos.nickName,
        avatar: userInfos.avatarUrl,
        identity: 0,
        sex: userInfos.gender,
        create_time: db.serverDate(),
        _openid: wxContext.OPENID,
        introduction: userInfos.introduction
      }
    })
  } catch (e) {
    console.log(e)
  }
}