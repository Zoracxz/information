// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user = db.collection('user')
  let option = event.option //查询条件
  let result = []
  //根据条件查找user
  if (option != null && typeof(option) != "undefined"){
    try{
      await user.doc(option).get().then(res => {
        console.log(res.data)
        result.push(res.data)
      })
    } catch (e) {
      console.log(e)
    }
  } //根据某个info中有哪些人投递了简历（身份为1以上的人方可查看）


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