//app.js

const loginUrl = require('config.js').loginUrl
const updateUserInfoUrl = require('config.js').updateUserInfoUrl
import AppManager from "lib/AppManager.js"

var authLoginManager = require('template/authLogin/authLoginManager.js')

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log("code:" + res.code)
          wx.request({
            url: loginUrl,
            method: 'POST',
            // header: {
            //   'content-type': 'application/json;charset=UTF-8' // 默认值
            // },
            data: {
              code: res.code
            },
            success: (res) => {
              var obj = res.data
              var uid = obj.data.uid
              console.log('uid:'+uid)
              var money = obj.data.total_money
              var isNew = obj.data.new_user
              var list = obj.data.recent
              AppManager.saveMoney(money)
              AppManager.saveUid(uid)
              AppManager.saveIsNew(isNew)
              if(list != undefined && list != "" && list.length != 0){
                var histroyData = list[0]
                AppManager.saveYesterdayMoneyChange(histroyData.history)
              }

              //获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        this.globalData.userInfo = res.userInfo

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                        AppManager.saveNickName(res.userInfo.nickName)
                        AppManager.saveHeadImg(res.userInfo.avatarUrl)
                        authLoginManager.updateUserInfo(res.userInfo)
                      }
                    })
                  }
                },
                fail: res => {
                  console.log(res)
                }
              })
            },
            fail: function() {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '服务异常',
              })
            }
          })
        }
      }
    })
   
  },


  
  // 全局变量
  globalData: {
    userInfo: null,
    uid:""
  }
})
