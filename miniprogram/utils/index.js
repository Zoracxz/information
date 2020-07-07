// 基于物品推荐
const RecommendinfosService = class RecommendinfosService {
  /**
  * 构造方法
  * @param {*倒查表所有数据组成的数组} data
  * @param {*信息ID} infosId
  * @param {*用户ID} userId
  * @param {*相似度最高的前k个} k
  */
  constructor(data, userId, k, infosId) {
    this.data = data
    this.infosId = infosId
    this.userId = userId
    // 筛选前k个信息······用于模块一······
    this.k = k
    // 保存待计算信息列表······用于模块一······
    this.infosList = []
    // 保存当前信息的投递人列表······用于模块一······
    this.users = []
    // 保存当前信息相似度列表······用于模块一······
    this.simpleList = []
    // 开启第二子系统-模块二
    // 保存当前人收藏信息列表
    this.userPerferList = []
    // 保存当前人没投递过的信息列表
    this.infosMayPerferList = []
    // 保存推荐结果并排序
    this.resultRank = []
    // 最终结果
    this.result = []
  }

  /**
  * 入口
  */
  start() {
    // 获取待计算数据
    this.getInitialData()
    // 开始计算用户对未投递过的信息感兴趣程度
    for (let infosId of this.infosMayPerferList.values()) {
      const res = this.getUserInterest(infosId)
      this.resultRank.push(res)
    }
    // 逆序排序
    this.resultRank.sort((a, b) => {
      return b.grade - a.grade
    })
    // 获取最终结果
    this.result = this.resultRank.reduce((array, obj) => {
      array.push(obj.infosId)
      return array
    }, [])
    return this.result
  }
  /**
  * 计算用户对该信息的感兴趣程度
  * @param {*信息ID} infosId
  */
  getUserInterest(infosId) {
    // 获取infosId相似的信息列表
    const simple = this.getinfosGrade(false, infosId)
    let grade = 0
    for (let [index, obj] of simple.entries()) {
      if (this.userPerferList.includes(obj.infosId) && index < this.k) {
        grade += obj.grade
      }
    }
    return { infosId, grade }
  }
  /**
  * 获取待计算数据
  */
  getInitialData() {
    // 获取当前人的收藏记录
    this.userPerferList = this.data.reduce((array, obj) => {
      if (obj.userId === this.userId && !array.includes(obj.infosId)) {
        array.push(obj.infosId)
      }
      // 将infoID整合
      return array
    }, [])
    // 获取当前用户没投递过的信息列表
    this.infosMayPerferList = this.data.reduce((array, obj) => {
      if (!array.includes(obj.infosId) && !this.userPerferList.includes(obj.infosId)) {
        array.push(obj.infosId)
      }
      return array
    }, [])
  }
  /**
  * 计算与信息infosId相似的前k个信息列表,······模块一······
  * @param {*是否去掉自身相关的信息} isDelSelf
  * @param {*信息ID} infosId
  */
  getinfosGrade(isDelSelf, infosId) {
    this.simpleList = []
    this.infosId = infosId
    // 获取待计算信息列表
    this.getinfosList()
    // 获取当前信息的投递人列表
    this.users = this.getinfosUserNum(this.infosId)
    // 计算相似度
    for (let infosId of this.infosList.values()) {
      this.getinfosSimple(infosId)
    }
    // 根据相似度排序
    this.simpleList.sort((a, b) => {
      //倒序
      return b.grade - a.grade
    })
    // 是否排除掉自身
    if (isDelSelf) {
      this.getNotSelfinfos()
    }
    // 相似度归一化
    this.gradeNormalization()
    return this.simpleList
  }
  /**
  * 获取目标信息数组
  */
  getinfosList() {
    //筛选除了本信息之外的信息数据
    const infosArray = this.data.reduce((array, obj) => {
      if (obj.infosId !== this.infosId) {
        array.push(obj.infosId)
      }
      return array
    }, [])
    //数组去重并解构
    const infos = [...new Set(infosArray)]
    // 得到目标信息列表
    this.infosList = infos
  }
  /**
  * 去掉已投递过的信息，得到目标信息数组
  */
  getNotSelfinfos() {
    // 筛选当前用户投递过的信息
    const userinfos = this.data.reduce((array, obj) => {
      if (obj.userId === this.userId) {
        array.push(obj.infosId)
      }
      return array
    }, [])
    // 删除本用户投递过的信息
    for (let [index, obj] of this.simpleList.entries()) {
      if (userinfos.includes(obj.infosId)) {
        this.simpleList.splice(index, 1)
      }
    }
  }
  /**
  * 获取信息相似度列表
  * @param {信息ID} infosId
  */
  getinfosSimple(infosId) {
    const users = this.getinfosUserNum(infosId)
    // 计算相似度的分母
    const bottom = Math.sqrt(this.users.length * users.length)
    let count = 0
    // 计算两个信息的共同用户数，得到相识度的分子
    for (let val of users.values()) {
      if (this.users.includes(val)) {
        // 惩罚活跃用户
        count += this.getSimpleElememt(val)
      }
    }
    // 保存结果对象，包括信息ID和相似度
    const res = {
      infosId,
      grade: count / bottom
    }
    this.simpleList.push(res)
  }
  /**
  * 提升算法，惩罚活跃用户，计算相似度分子
  * @param {*用户ID} userId
  */
  getSimpleElememt(userId) {
    // 找到用户投递过的信息数量
    const infosNum = this.data.reduce((array, obj) => {
      if (obj.userId === userId) {
        array.push(obj.infosId)
      }
      return array
    }, [])
    const count = [...new Set(infosNum)].length
    const element = 1 / Math.log(1 + count)
    return element
  }
  /**
  * 获取信息的投递人
  * @param {*信息ID} infosId
  */
  getinfosUserNum(infosId) {
    //得到信息的投递人
    const users = this.data.reduce((array, obj) => {
      if (obj.infosId === infosId) {
        array.push(obj.userId)
      }
      return array
    }, [])
    return [...new Set(users)];
  }
  /**
  * 相似度归一化
  */
  gradeNormalization() {
    // 取最大值
    const max = this.simpleList[0].grade
    for (let index of this.simpleList.keys()) {
      this.simpleList[index].grade = this.simpleList[index].grade / max
    }
  }
}

module.exports = { RecommendinfosService }