// pages/market/market.js
import AppHttpHelper from "../../lib/AppHttpHelper";

const productListUrl = require('../../config.js').productListUrl;
const getExchangeUrl = require('../../config.js').getExchangeUrl;
import AppManager from "../../lib/AppManager.js";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        productList: [],
        todaycoin:0,
        totalcoin:0,
        allMoney: 0
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
    /**
     * 跳转到金币明细页面
     */
    goMyPointsPage: function() {
        wx.navigateTo({
            url: '../mypoints/mypoints'
        });
    },

    /**
     * 首日分享小程序
     */
    goShareOnce: function() {
        wx.switchTab({
            url: '../index/index'
        });
    },

    /**
     * 首日分享小程序
     */
    goPKOnce: function() {
        wx.switchTab({
            url: '../index/index'
        });
    },



    /**
     * 获取换购商品列表
     */
    getProductList: function () {
        var that = this;
        AppHttpHelper.getReqByUid(
            productListUrl,
            {},
            (res) => {
                console.log(res);
                var _productList = res.data.data;
                //console.log('product:' + _productList);
                that.setData({
                    productList: _productList
                });
            },
            (res) => {
                console.log(res);
            }
        );
       /* wx.request({
            url: productListUrl,
            success: res => {
                console.log(res);
                var _productList = res.data.data;
                //console.log('product:' + _productList);
                that.setData({
                    productList: _productList
                });
            },
            fail: res => {
                console.log(res.data);
            }
        });*/

    },

    /**
     * 检查用户的积分状况，如果用户积分够换取该礼品，就跳转到积分换购的详情页，否则提示用户积分不够
     */
    goRedemptionDetailPage: function (e) {
        let item = e.currentTarget.dataset.item;
        // 检查用户总积分，积分不够就弹窗提示用户
        let totalMoney = AppManager.getMoney();
        console.log('商品价格'+item.price);
        if (totalMoney < item.price) {
            wx.showToast({
                title: "您的积分不足换此商品",
                icon: 'none',
                duration: 2000
            });
            return;
        }
        // 积分充足，跳转到商品换购详情页
        wx.navigateTo({
            url: 'redemptiondetail?id=' + item.id+'&price='+item.price
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取换购商品列表
        this.getProductList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.getMyCoin();
        /*that.setData({
            points: AppManager.getMoney()
        });*/
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let uid = AppManager.getUid();
        return {
            title: "跟我一起参与趣PK，赢取更多PK币~",
            path:'/pages/index/index?invite_uid='+uid,
            imageUrl:'/images/bg_share.png',
        }
    }
});