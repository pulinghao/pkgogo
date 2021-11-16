// pages/rank/rank.js
import AppManager from "../../lib/AppManager";
import AppHttpHelper from "../../lib/AppHttpHelper";
var authLoginManager = require('../../template/authLogin/authLoginManager.js')

const getClockRanking = require('../../config.js').getClockRanking;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rankList: [],
        threeList: [],
        userRank: 0,
        updateTime: "",
        pkTitle: "",
        punchid:''
    },

    getClockRanking: function (punchid) {
        let that = this;
        var uid = AppManager.getUid();
        AppHttpHelper.getReqByUid(
            getClockRanking,
            {
                punchid: punchid,
            },
            (res) => {
                console.log(res);
                var data = res.data.data.rankingList;
                var userRank = res.data.data.you_rank;
                console.log("当前排名" + userRank);
                var updateTime = res.data.data.update_time;
                console.log(updateTime);
                var threeList = [];
                var rankList = [];
                var j = 0;
                for (var i = 0; i < 3; i++) {
                    threeList[i] = data[i];
                    console.log(threeList[i]);
                }
                for (var i = 3; i < data.length; i++) {
                    rankList[j++] = data[i];
                }
                /!*  console.log("threeList"+threeList[2].name)*!/
                that.setData({
                    threeList: threeList,
                    rankList: rankList,
                    userRank: userRank,
                    updateTime: updateTime
                })
            },
            (res) => {
                console.log(res);
            }
        );
        /*wx.request({
            url: getClockRanking,
            method: 'get',
            dataType: 'json',
            header: {
                'uid': uid,
                'content-type': 'application/json'
            },
            data: {
                punchid: punchid,
            },
            success: res => {
                console.log(res);
                var data = res.data.data.rankingList;
                var userRank = res.data.data.you_rank;
                console.log("当前排名" + userRank);
                var updateTime = res.data.data.update_time;
                console.log(updateTime);
                var threeList = [];
                var rankList = [];
                var j = 0;
                for (var i = 0; i < 3; i++) {
                    threeList[i] = data[i];
                }
                for (var i = 3; i < data.length; i++) {
                    rankList[j++] = data[i];
                }
                /!*  console.log("threeList"+threeList[2].name)*!/
                that.setData({
                    threeList: threeList,
                    rankList: rankList,
                    userRank: userRank,
                    updateTime: updateTime
                })
            },
            fail: res => {
                console.log(res.data);
            }
        });*/
    },
    /*
    获取头部用户信息
    */
    _getUserInfo: function () {
        var that = this;
        authLoginManager.authLogin(
            this,
            () => {
                that.setData({
                    headImg: AppManager.getHeadImg(),
                    nickName: AppManager.getNickName(),
                    /*money: AppManager.getMoney(),*/
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


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getClockRanking(options.punchid);
        this.setData({
          pkTitle: options.pkTitle,
          punchid: options.punchid
        })
        console.log("PK标题" + options.pkTitle);
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
        this._getUserInfo();
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
        return {
            title: "我在早起打卡PK中排行" + this.data.userRank + "名，你呢？",
          path: '/pages/rank/rank?punchid=' + this.data.punchid + '&pkTitle=' + this.data.pkTitle,
            /*imageUrl:'/images/bg_share.png',*/
        }
    }
})
