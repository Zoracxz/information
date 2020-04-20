// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const $ = db.command.aggregate
  const _ = db.command
  const informations = db.collection("informations")
  let r_id = event.r_id
  let type = event.type
  let title = event.title
  let page = event.page
  const limit = 10
  let result = []
  //按类型查询
  if (type && typeof (type) != "undefined"){
    type = parseInt(type)
    await informations.aggregate().match({
      type: type
    }).sort({
      deadline: -1
    }).lookup({
      from: 'company',
      let: {
        company_id: '$c_id',
        info_type: '$type'
      },
      pipeline: $.pipeline()
        .match(_.expr($.eq(['$_id', '$$company_id'])))
        .project({
          _id: 0,
          icon: 1,
          company_name: 1,
          type: 1,
          p_numbers: 1
        })
        .done(),
      as: 'c_info',
    }).end().then(res => {
      result = res.list
    }).catch(err => console.error(err))
    //按标题查询
  }else if(title && typeof(title) != "undefined"){
    let regexp = '^(.*' + title + '.*)$'
    await informations.aggregate().match({
      title: db.RegExp({
        regexp: '^(.*' + title + '.*)$',
        options: 'i'
      })
    }).lookup({
      from: 'company',
      let: {
        company_id: '$c_id',
        info_type: '$type'
      },
      pipeline: $.pipeline()
        .match(_.expr($.eq(['$_id', '$$company_id'])))
        .project({
          _id: 0,
          icon: 1,
          company_name: 1,
          type: 1,
          p_numbers: 1
        })
        .done(),
      as: 'c_info',
    }).end().then(res => {
      result = res.list
    }).catch(err => console.error(err))
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