// pages/user/usercenter.js

var authLoginManager = require('../../template/authLogin/authLoginManager.js')
import AppManager from "../../lib/AppManager.js"
import AppHttpHelper from "../../lib/AppHttpHelper.js"

var usercenterUrl = require("../../config.js").usercenterUrl
var getMyPk = require("../../config.js").getMyPk
const getExchangeUrl = require('../../config.js').getExchangeUrl;
const getMyClockUrl = require('../../config.js').getMyClockUrl;
const goLikeURL = require('../../config.js').goLikeURL;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        item: {
            showLogin: false
        },
        headImg: "",
        nickName: "",
        money: 0,
        navList:[
            "打卡记录",
            "我的竞猜"
        ],
        currentIndexNav:0,
        myClockList:[],
        mypkList:[],
        pageIndex: 1, //分页索引
        size: 5,   //每次分页拉多少个元素
    },

    activeNav:function(e){
        console.log("点击导航栏"+e.currentTarget.dataset.index)
        this.setData({
            currentIndexNav:e.currentTarget.dataset.index
        })
    },
    goQuestionPage: function () {
        wx.navigateTo({
            url: '../market/market'
        })
    },
    onScrollToLower: function (e) {
        console.log("是否触发" + this.data.pageIndex);
        this.getMyClock(this.data.pageIndex, false);
    },

    goMyPointsPage: function () {
        wx.navigateTo({
            url: '../mypoints/mypoints'
        })
    },

    getMyClock: function (pageIndex, isFirst) {
        let that = this;
        var index=0;
        //let pageIndex = this.data.pageIndex
        let size = this.data.size;

        if (isFirst === true) {
            pageIndex = 1;
        } else {
            pageIndex = pageIndex + 1;
        }

        AppHttpHelper.getReqByUid(
            getMyClockUrl,
            {
                page: pageIndex,
                size: size
            },
            (res) => {
                var data = res.data.data;
                var dataList = [];
                if (isFirst === true) {
                    dataList = data;
                } else {
                    dataList = this.data.myClockList.concat(data);
                }
                console.log("分页：" + pageIndex);
                that.setData({
                    pageIndex: pageIndex,
                    myClockList: dataList,
                })
            },
            (res) => {
                console.log(res)
            }
        );

    },
    /*
    跳转到评论
    */
    goComment: function (e) {
        let discussid = e.currentTarget.dataset['index'];
        var discussNum= e.currentTarget.dataset['item'];
        if(discussNum==""||discussNum==undefined){
            wx.navigateTo({
                url: '/pages/comment/comment?discussid=' + discussid,
            })
        }else {
            wx.navigateTo({
                url: "/pages/up_clock/detail?discussid=" + discussid + "&pageIndex=1" + "&size=" + this.data.size
            })
        }
        /*wx.navigateTo({
            url: "/pages/up_clock/detail?discussid=" + discussid + "&pageIndex=1" + "&size=" + this.data.size
        })*/
    },
    /*
      点赞
      */
    goLike: function (e) {
        var that = this
        console.log("点赞了吗")
        let id = e.currentTarget.dataset['index'];
        let islike = e.currentTarget.dataset['mark'];
        let mark = 0;
        if (islike === false) {
            mark = 1;
        } else {
            mark = 0;
        }
        console.log("index" + mark);
        let uid = AppManager.getUid();
        wx.request({
            url: goLikeURL,
            method: 'POST',
            dataType: 'json',
            header: {
                'uid': uid,
                'content-type': 'application/json'
            },
            data: {
                discussid: id,
                mark: mark,
            },
            success: res => {
                console.log("成功");
                console.log(mark);
                console.log(res);
                var resultList = this.data.myClockList;
                for (var i = 0; i < resultList.length; i++) {
                    if (resultList[i].id === id) {
                        resultList[i].isLike = (mark == 0 ? false : true);
                        if (mark == 0) {
                            resultList[i].likeNum--;
                        } else {
                            resultList[i].likeNum++;
                        }
                    }
                }
                this.setData({
                    myClockList: resultList
                })
                console.log("成功");
            },
            fail: res => {
                console.log(res.data);
            }
        });
    },

    //请求我参与的PK
    requestMyPkList: function (pageIndex,isFirst) {
        var that = this;
        var size = that.data.size;
        if (isFirst === true) {
            pageIndex = 1;
        } else {
            pageIndex = pageIndex + 1;
        }
        AppHttpHelper.getReqByUid(getMyPk,
            {
                page: pageIndex,
                size: size
            },
            (res) => {
                console.log('res' + res);
                var mypkList = res.data.data;
                that.setData({
                    mypkList: mypkList
                })
            },
            (res) => {

            }
        )
    },

    //跳转到打卡详情页
    goClockDetail:function(e){
        let id = e.currentTarget.dataset['punchid'];
        let isIndex=true;
        wx.navigateTo({
            url: '../../pages/up_clock/clocklist?id=' +id+'&isIndex='+isIndex, //0表示普通页面进入
        })
    },

    //跳转到详情页面
    goDetailPage: function(e) {
        let item = e.currentTarget.dataset.item;
        console.log('my'+item.id);
        wx.navigateTo({
            url: '../pk_detail/competition?id=' + item.id + '&isFromShare=0', //0表示普通页面进入
        })
    },


    getSystemUserInfo: function (e) {
        authLoginManager.getSystemUserInfo(e)
        this.setData({
            headImg: AppManager.getHeadImg(),
            nickName: AppManager.getNickName(),
            money: AppManager.getMoney(),
            item: {
                showLogin: false
            }
        })
    },

    onClickCancel: function (e) {
        this.setData({
            item: {
                showLogin: false
            }
        })
    },

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
            let  AllMoney= res.data.data.money;
            that.setData({
              AllMoney: AllMoney,
            });
          },
          (res) => {
            console.log(res);
          }
      );
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        var that = this
        that._getUserInfo();
        that.getMyCoin();
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

        this.requestMyPkList(this.data.pageIndex,true);
        this.getMyClock(this.data.pageIndex,true);
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

    },

})
