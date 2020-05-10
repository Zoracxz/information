// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const $ = db.command.aggregate
  const _ = db.command
  const informations = db.collection("informations")
  let type = event.type
  let title = event.title
  let page = event.page
  let release = event.release
  let ids = event.ids
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
        hr_id: '$hr_id',
        info_type: '$type'
      },
      pipeline: $.pipeline()
        .match(_.expr($.in(['$$hr_id', '$hr_ids'])))
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
    //let regexp = '^(.*' + title + '.*)$'
    await informations.aggregate().match({
      title: db.RegExp({
        regexp: '^(.*' + title + '.*)$',
        options: 'i'
      })
    }).lookup({
      from: 'company',
      let: {
        hr_id: '$hr_id'
      },
      pipeline: $.pipeline()
        .match(_.expr($.in(['$$hr_id', '$hr_ids'])))
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
  } else if (release && typeof (release) != "undefined"){
    //根据openid查询
    await informations.aggregate().match({
      hr_id: wxContext.OPENID
    }).lookup({
      from: 'company',
      let: {
        hr_id: '$hr_id',
        info_type: '$type'
      },
      pipeline: $.pipeline()
        .match(_.expr($.in(['$$hr_id', '$hr_ids'])))
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
    //根据id查询
  } else if (ids && typeof (ids) != "undefined"){
    await informations.aggregate().match({
      _id: _.in(ids)
    }).lookup({
      from: 'company',
      let: {
        hr_id: '$hr_id',
        info_type: '$type'
      },
      pipeline: $.pipeline()
        .match(_.expr($.in(['$$hr_id', '$hr_ids'])))
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
  }
  else{
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