// pages/game/detail.js
import AppManager from "../../lib/AppManager.js"
import AppHttpHelper from "../../lib/AppHttpHelper.js"

const getPKDetailUrl = require("../../config.js").getPKDetailUrl
const joinPKUrl = require("../../config.js").joinPKUrl
const signinUrl = require("../../config.js").signinUrl
const quitPKUrl = require("../../config.js").quitPKUrl


Page({

    /**
     * 页面的初始数据
     */
    data: {
        html: '',
        instructions: [],
        flag: false,   //蒙层
        item: null,
        rightBarColor: "#000000",
        rightBarText: "",
        hasJoin: false,
        hasSignIn: false,
        hasAllowSignIn: false,
        pk_stat: {
            pk_finish_num: 0,
            pk_finish_percent: 0,
            pk_unfinish_num: 0,
            pk_unfinish_percent: 0
        }, //pk统计
        fee: 0,      //每日花费费用
        myMoney: 0,      //可用积分
        task_id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _id = options.id
        let isFromShare = options.isFromShare
        let shareid = ''
        if (isFromShare != 0) {
            shareid = options.shareid
        }
        let _uid = AppManager.getUid()
        this.setData({
            task_id: _id
        })
        this.requestDetail(_uid, _id, shareid)
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
            title: '来一场' + this.data.data.item.title + '!',
            path: '/pages/game/detail?id=' + this.data.data.task_id + '&shareid=' + AppManager.getUid(),
        }
    },

    // 立即参与
    onClickJoin: function (e) {
        var uid = AppManager.getUid();
        var pk_id = this.data.item.auto_id;
        var hasJoin = this.data.hasJoin;
        var hasSignIn = this.data.hasSignIn;
        var hasAllowSignIn = this.data.hasAllowSignIn;
        if (hasJoin) {
            if (hasSignIn || !hasAllowSignIn) {
                wx.showModal({
                    title: '提示',
                    content: '您确实要退出这个PK吗？',
                    success: res => {
                        if (res.confirm) {
                            this.handleQuitPk(pk_id)
                        } else if (res.cancel) {

                        }
                    }
                })
            } else {
                this.handleSignIn(uid, pk_id)
            }
        } else {
            this.setData({
                flag: true
            })
        }


    },

    // 取消弹框
    onClickCacelJoin: function (e) {

    },

    // 确认弹框
    confirmToJoin: function (e) {

    },

    // 确认
    onClickConfirm: function (e) {
        var _uid = AppManager.getUid();
        var _pk_id = this.data.item.task_id
        if (this.data.hasJoin) {
            //签到
            this.handleSignIn(_uid, _pk_id)
        } else {
            //参与
            this.handleJoin(_uid, _pk_id)
        }
    },

    //取消
    onClickCancel: function (e) {
        this.setData({
            flag: false
        })
    },


    //=============业务接口============
    //签到
    handleSignIn: function (uid, pk_id) {
        wx.request({
            url: signinUrl,
            method: 'POST',
            data: {
                task_id: pk_id,
                uid: uid
            },
            success: res => {
                wx.showToast({
                    title: '打卡成功!等待开奖吧!',
                })

                this.updateJoinButtonContent(res)
            },
            fail: res => {

            }
        })
    },

    // 参与
    handleJoin: function (uid, pk_id) {
        var that = this
        wx.request({
            url: joinPKUrl,
            method: 'POST',
            data: {
                task_id: pk_id,
                uid: uid
            },
            success: res => {
                var data = res.data.data
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '参与成功!',
                    })

                    //更新用户的积分
                    AppManager.saveMoney(data.total_money);

                    that.setData({
                        hasJoin: res.data.data.hasJoin,
                        hasSignIn: res.data.data.hasSignIn,
                        flag: false,
                        myMoney: data.total_money
                    })
                    that.updateJoinButtonContent(res)
                } else if (data.error == 1) {
                    wx.showToast({
                        title: data.err_msg,
                        icon: 'none',
                        mask: true
                    })
                    that.setData({
                        flag: false
                    })
                } else {
                    wx.showToast({
                        title: "错误码:" + res.data.code,
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: res => {

            }
        })
    },

    //退出PK
    handleQuitPk: function (pk_id) {
        var that = this;
        AppHttpHelper.postReqByUid(
            quitPKUrl,
            {
                task_id: pk_id
            },
            (res) => {
                var data = res.data.data
                that.setData({
                    hasJoin: data.hasJoin,
                    hasSignIn: data.hasSignin,
                })

                this.updateJoinButtonContent(res)


            },
            (res) => {
                console.log(res)
            }
        )
    },

    // 首次进入页面的请求
    requestDetail: function (uid, pk_id, sharer_id) {
        var that = this
        AppHttpHelper.postReqByUid(
            getPKDetailUrl,
            {
                task_id: pk_id,
                sharer_id: sharer_id
            },
            (res) => {
                console.log(res)

                var data = res.data.data
                var hasJoin = data.hasJoin
                var hasSignIn = data.hasSignin
                var hasAllowSignIn = data.hasAllowSignin
                var _rightColor = "#000000"
                var _rightText = ""
                if (hasJoin) {
                    if (hasAllowSignIn) {
                        if (hasSignIn) {
                            _rightColor = "#797979"  //pk参与中的颜色
                            _rightText = "PK参与中"
                        } else {
                            _rightColor = "#0076FF"  //签到打卡的颜色
                            _rightText = "签到打卡"
                        }
                    } else {
                        _rightColor = "#797979"  //pk参与中的颜色
                        _rightText = "PK参与中"
                    }
                } else {
                    _rightColor = "#FF003C"  //红色
                    _rightText = "立即参与"
                }
                that.setData({
                    item: res.data.data,
                    rightBarColor: _rightColor,
                    rightBarText: _rightText,
                    fee: data.fee,
                    instructions: data.pk_rules_sub,
                    hasJoin: res.data.data.hasJoin,
                    hasSignIn: res.data.data.hasSignin,
                    hasAllowSignIn: res.data.data.hasAllowSignin,
                    myMondey: AppManager.getMoney(),
                    pk_stat: {
                        pk_finish_num: res.data.data.pk_finish_num,
                        pk_finish_percent: res.data.data.pk_finish_percent * 100,
                        pk_unfinish_num: res.data.data.pk_unfinish_num,
                        pk_unfinish_percent: res.data.data.pk_unfinish_percent * 100
                    }
                })
            },
            (res) => {
                console.log(res)
            }
        )
        // wx.request({
        //   url: getPKDetailUrl,
        //   method: 'POST',
        //   data:
        //   {
        //     task_id: pk_id,
        //     uid: uid
        //   },
        //   success: res => {

        //   },
        //   fail: res => {
        //     console.log(res)
        //   }
        // })
    },


    //更新底部参与按钮的颜色和文案
    updateJoinButtonContent: function (res) {
        var data = res.data.data
        var hasJoin = data.hasJoin
        var hasSignIn = data.hasSignin
        var hasAllowSignIn = data.hasAllowSignIn
        var _rightColor = "#000000"
        var _rightText = ""
        if (hasJoin) {
            if (hasAllowSignIn) {
                if (hasSignIn) {
                    _rightColor = "#797979"  //pk参与中的颜色
                    _rightText = "PK参与中"
                } else {
                    _rightColor = "#0076FF"  //签到打卡的颜色
                    _rightText = "签到打卡"
                }
            } else {
                _rightColor = "#797979"  //pk参与中的颜色
                _rightText = "PK参与中"
            }

        } else {
            _rightColor = "#FF003C"  //红色
            _rightText = "立即参与"
        }

        this.setData({
            rightBarColor: _rightColor,
            rightBarText: _rightText,
        })
    },


    //分享给好友
    onClickShare: function (e) {
        this.onShareAppMessage();
    }

})