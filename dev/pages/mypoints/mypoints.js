// pages/mypoints/mypoints.js
import AppHttpHelper from "../../lib/AppHttpHelper.js"
import AppManager from "../../lib/AppManager.js"

const pointsHistoryUrl = require("../../config.js").pointsHistoryUrl;
const getExchangeUrl = require('../../config.js').getExchangeUrl;
//Page Object
Page({
    /**
     * 页面初始化数据
     */
    data: {
        historyList: [],
        allMoney: 0
    },
    
    /** 
     * 获取积分列表详情
    */
    getPointsHistory: function() {
        let that = this;
        wx.showLoading({
          title: '正在加载...',
        })
        AppHttpHelper.getReqByUid(
            pointsHistoryUrl,
            {},
            (res) => {
                wx.hideLoading()
              wx.showToast({
                title: '加载成功',
              })
                let  historyList= res.data.data;
                console.log(historyList);
                that.setData({
                    historyList: historyList
                });
            },
            (res) => {
                wx.hideLoading()
                wx.showToast({
                  title: '加载失败',
                })
                console.log(res);
            }
        );
    },

    /**
     * 获取我的金币数量
     */
    getMyCoin:function(){
        let that = this;
        AppHttpHelper.getReqByUid(
            getExchangeUrl,
            {},
            (res) => {
                console.log(res);
                let allMoney = res.data.data.money;
                let  todaycoin= res.data.data.todayMoney;
                let  totalcoin= res.data.data.totalMoney;
                console.log('totalcoin'+totalcoin);
                that.setData({
                    allMoney:allMoney,
                    todaycoin: todaycoin,
                    totalcoin: totalcoin
                });
            },
            (res) => {
                console.log(res);
            }
        );
    },
    //options(Object)
    onLoad: function(options){
        this.getPointsHistory();
    },
    onReady: function(){
        
    },
    onShow: function(){
        var that = this;
        that.getMyCoin();
    },
    onHide: function(){

    },
    onUnload: function(){

    },
    onPullDownRefresh: function(){

    },
    onReachBottom: function(){

    },
    onShareAppMessage: function(){

    },
    onPageScroll: function(){

    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    }
});