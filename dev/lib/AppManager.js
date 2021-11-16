// 工具类
// 1.管理用户的信息 uid nickName avatalUrl
class AppManager
{
  constructor(){
  }
  
  // UID
  static getUid()
  {
    return wx.getStorageSync('uid');
  }

  static saveUid(uid)
  {
    wx.setStorageSync('uid', uid)
  }

  // 昵称:NickName
  static getNickName()
  {
    return wx.getStorageSync('nickName');
  }

  static saveNickName(name)
  {
    wx.setStorageSync('nickName', name)
  }

  //头像:headImg
  static getHeadImg()
  {
    return wx.getStorageSync('headImg');
  }

  static saveHeadImg(headImg)
  {
    wx.setStorageSync('headImg', headImg)
  }

  //积分：total_money
  static getMoney()
  {
    return wx.getStorageSync('money') 
  }

  static saveMoney(money){
    wx.setStorageSync('money', money)
  }

  static getIsNew()
  {
    var isNew = wx.getStorageSync('isNew')
    if(isNew == null || isNew == undefined) {
      isNew = true
    }
    return isNew
  }

  static saveIsNew(isNew)
  {
    wx.setStorageSync('isNew', isNew)
  }

  static getLoginDate()
  {
    var today = new Date()
    var key = today.toLocaleDateString()
    var login = wx.getStorageSync(key)
    // return false;
    if(login == null || login == undefined || login == ""){
      return false
    } else {
      return login
    }
  }

  static saveLoginDate()
  {
    var today = new Date()
    var key = today.toLocaleDateString()
    var login = wx.setStorageSync(key,true)
  }

  static getYesterdayMoneyChange()
  {
    return wx.getStorageSync('yesterdayList')
  }

  static saveYesterdayMoneyChange(list)
  {
    wx.setStorageSync('yesterdayList', list)
  }

  /*
  * 检查用户是否授权
  */
  static checkHasAuth()
  {
    let nickname = this.getNickName()
    if(nickname == 'null' || nickname == null){
      return false
    } else {
      return true
    }
  }
}

export default AppManager