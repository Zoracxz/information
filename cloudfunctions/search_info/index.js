// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const informations = db.collection("informations")
  let r_id = event.r_id
  let type = event.type
  let title = event.title
  let page = event.page
  const limit = 10
  let result = []
  //按类型查询
  if (type && typeof (type) != "undefined"){
    await informations.where({
      type: type
    }).orderBy('deadline','asc').get().then(res => {
      result = res.data
    }).catch(err => {
      console.log(err)
    })
    console.log(result)
    //按标题查询
  }else if(title && typeof(title) != "undefined"){
    await informations.where({
      title: db.RegExp({
        regexp: '^(.*' + title + '.*)$',
        option: 'i'
      })
    }).get().then(res => {
      result = res.data;
    }).catch(err => {
      console.log(err)
    })
    console.log(result)
  } else if (r_id && typeof (r_id) != "undefined"){
    //根据id精确查询
    await informations.doc(r_id).get().then(res => {
      result.push(res.data)
    }).catch(err => {
      console.log(err)
    })
  }else{
    //默认查询，按最近发布排列
    await informations.skip(page * limit).limit(limit).orderBy('release_time','desc').get().then(res => {
      result = res.data;
    }).catch(err => {
      console.log(err)
    })
    console.log(result)
  }
  return result
}