var authLoginManager = require('../../template/authLogin/authLoginManager.js')
import AppManager from "../../lib/AppManager.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headImg: String,
    nickName: String,
    money: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    headImg: "",
    nickName: "",
    money: ""
  },

  lifetimes: {
    attached() {
      this._getUserInfo();
    }
  },

  /** 各个方法 */
  methods: {
    /** 获取用户信息 */
    _getUserInfo() {
      var that = this;
      authLoginManager.authLogin(
        this,
        () => {
          that.setData({
            headImg: AppManager.getHeadImg(),
            nickName: AppManager.getNickName(),
            money: AppManager.getMoney(),
            item: {
              showLogin: false
            },
          })
        },
        () => {
          that.setData({
            item: {
              showLogin: true
            },
          })
        })
    },

    goMarketPage: function() {
      wx.navigateTo({
        url: '../market/market'
      });
    },

    goMyPointsPage: function() {
      wx.navigateTo({
        url: '../mypoints/mypoints'
      });
    },

   /* /!**
     * 获取我的金币数量
     *!/
    getMyCoin:function(){
      let that = this;
      AppHttpHelper.getReqByUid(
          getExchangeUrl,
          {},
          (res) => {
            console.log(res);
            let  AllMoney= res.data.data.money;
            that.setData({
              AllMoney: AllMoney,
            });
          },
          (res) => {
            console.log(res);
          }
      );
    },*/
  }

})