//获取资源组成数组
function getResource(result, that){
  // console.log(result)
  result.forEach(function (item) {
    var release_time = item.release_time.match(/^[0-9]*-[0-9]*-[0-9]*/)[0]
    var c_info = item.c_info[0]
    var newresource = [{
      'id': item._id,
      'title': item.title,
      'location': item.location,
      'frequency': item.frequency,
      'release_time': release_time,
      'salary': item.salary,
      'tags': item.tags,
      'icon': c_info.icon,
      'company_name': c_info.company_name,
      'type': c_info.type,
      'p_numbers': c_info.p_numbers,
      'introduction': item.introduction,
      'hr_id': item.hr_id,
      'education': item.education,
      'welfare': item.welfare,
      'hot': item.hot,
    }];
    that.data.resources = newresource.concat(that.data.resources);
    that.setData({
      resources: that.data.resources
    })
  })
  
}

module.exports.getResource = getResource