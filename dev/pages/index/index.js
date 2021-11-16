//index.js
//获取应用实例
const app = getApp()
var authLoginManager = require('../../template/authLogin/authLoginManager.js')
import AppManager from "../../lib/AppManager.js"
import AppHttpHelper from "../../lib/AppHttpHelper.js"

const getPkListUrl = require('../../config.js').getPKListUrl;
const getFeedUrl = require('../../config.js').getFeedUrl;
const pkResultPopupUrl = require('../../config.js').pkResultPopupUrl;
const readPopupUrl = require('../../config.js').readPopupUrl;
const inviteUrl = require('../../config.js').inviteUrl;
const getExchangeUrl = require('../../config.js').getExchangeUrl;
const getHeadPKUrl = require('../../config.js').getHeadPKUrl;
const getClockRecordUrl=require('../../config.js').getClockRecordUrl;
const goLikeURL = require('../../config.js').goLikeURL;

var animation = wx.createAnimation();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        dataList: [],
        messageList: [],
        currentFeed: '', // 当前展示的 feed
        isShowFeed: '', // 是否展示Feed
        resultList: [],
        PK_isModalHide: false,
        isHideYesterdayModel: true,
        isNewUser: true,
        recentPoints: {
            history: []
        },
        yesterdayGetPoints: 0,
        totalPoints: 0,
        conductPk: {}, // 进行中的 PK 字段
        conductPkModal: {},
        isShowConductPk: false,
        item: {
            showLogin: false
        },
        isShowToast:false,
        headImg:'',
        nickName:'',
        money:'',
        headPKList: [

        ],// 首页pk 顶部横向的pk列表
        pageIndex: 1, //分页索引
        size: 5,   //每次分页拉多少个元素
        clockList:[]
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function (options) {
        let uid = AppManager.getUid();
        console.log('邀请人ID' + options.invite_uid);
        if (options.invite_uid) {
            console.log('进来这里了吗');
            this.goInviteFriends(options.invite_uid);
        }
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        // 获取PK列表
        this.getPkList();
        //获取首页Feed信息流
        this.getFeeds();
        this.getPkResult();
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

    onShow: function () {
        var that = this
        this._getUserInfo();
        this.getMyCoin();
        this.getHeadPk();
        this.getClockRecord(this.data.pageIndex, true);
    },

    onReady: function () {
        //滞后于login接口
        setTimeout(() => {
            var isNew = AppManager.getIsNew()
            if (!isNew) {
                //不是新用户，展示昨日战果
                var isFirstLoginToday = AppManager.getLoginDate()
                if (!isFirstLoginToday) {
                    var history = AppManager.getYesterdayMoneyChange()
                    var totalPoints = AppManager.getMoney()
                    var total = 0;
                    for (var i = 0; i < history.length; i++) {
                        var each = history[i]
                        total = total + each.money
                    }
                    this.setData({
                        isHideYesterdayModel: false,
                        yesterdayGetPoints: total,
                        recentPoints: {
                            history: history
                        },
                        totalPoints: totalPoints
                    })
                }
            } else {
                //新用户，不用展示
                this.setData({
                    isNewUser: isNew
                })
            }
        }, 1000)
    },

    onShareAppMessage: function () {
        /*let uid = AppManager.getUid();
        var isShareOK=this.goShareOnce(uid);
        if(isShareOK==='1'){
            setTimeout(() => {
                this.setData({
                    isShowToast:true
                })
            }, 4 * 1000);
        }
        else {
            setTimeout(() => {
                wx.showToast({
                    icon: 'none',
                    title: '您已参加过此任务',
                    duration: 3000
                });
            }, 6 * 1000);
        }*/
        return {
            title:"快，来和我进行一场PK",
            path: '/pages/index/index',
            imageUrl: '/images/bg_share.png',
        };
    },

    getUserInfo: function (e) {
            console.log(e)
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
        }

    ,

    onScrollToLower: function (e) {
        console.log("是否触发" + this.data.pageIndex);
        this.getClockRecord(this.data.pageIndex, false);
    },

    // 1.获取PK列表
    getPkList: function () {
        var that = this
        AppHttpHelper.getReqByUid(
            getPkListUrl, {},
            (res) => {
                var _dataList = res.data.data
                console.log(_dataList)
                that.setData({
                    dataList: _dataList
                })
            },
            (res) => {
                console.log(res)
            }
        );
    },

    //获取用户打卡记录
    getClockRecord:function(pageIndex, isFirst){
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
            getClockRecordUrl,
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
                    dataList = this.data.clockList.concat(data);
                }
                console.log("分页：" + pageIndex);
                that.setData({
                    pageIndex: pageIndex,
                    clockList: dataList,
                })
            },
            (res) => {
                console.log(res)
            }
        );

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
                var clockList = this.data.clockList;
                for (var i = 0; i < clockList.length; i++) {
                    if (clockList[i].id === id) {
                        clockList[i].isLike = (mark == 0 ? false : true);
                        if (mark == 0) {
                            clockList[i].likeNum--;
                        } else {
                            clockList[i].likeNum++;
                        }
                    }
                }
                //that.getClockList(that.data.punchid,that.data.pageIndex);
                this.setData({
                    clockList: clockList
                })
                console.log("成功");
            },
            fail: res => {
                console.log(res.data);
            }
        });
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

    //跳转到打卡详情页
    goClockDetail:function(e){
        let id = e.currentTarget.dataset['punchid'];
        let isIndex=true;
        wx.navigateTo({
            url: '../../pages/up_clock/clocklist?id=' +id+'&isIndex='+isIndex, //0表示普通页面进入
        })
    },

    // 投票
    onHandleVote: function (e) {
        let _that = this;
        let yesOrNo = _that.data.conductPkModal.userOption;
        if (_that.data.conductPk.seal) {
            _that.setData({
                conductPkModal: {
                    isShowJoinPkMask: true,
                    isShowJoinPkModal: false,
                    isShowJoinPkFail: true,
                    failMsg: "已停止投票"
                }
            });

            setTimeout(() => {
                _that.setData({
                    conductPkModal: {
                        isShowJoinPkMask: false,
                        isShowJoinPkFail: false
                    }
                });
            }, 2 * 1000);

            return;
        }
        let _id = _that.data.conductPk.id;
        let _params = {
            topicid: _id,
            option: yesOrNo
        };
        AppHttpHelper.postReqByUid(
            conductJoinInPKUrl,
            _params,
            (res) => {
                if (res.data.code == 200) {
                    let _data = res.data.data;
                    _that.setData({
                        conductPk: {
                            title: _data.title,
                            remark: _data.remark,
                            img: _data.img,
                            joinNum: _data.joinNum,
                            option1Num: _data.option1Num,
                            option1Percent: _data.option1Percent,
                            option2Num: _data.option2Num,
                            option2Percent: _data.option2Percent,
                            joinIn: true,
                            payMoney: _data.payMoney,
                            userMoney: _data.userMoney,
                            userOption: _data.userOption
                        },
                        conductPkModal: {
                            isShowJoinPkMask: true,
                            isShowJoinPkSuccess: true
                        }
                    });

                    // 参与成功提示消失
                    setTimeout(() => {
                        _that.setData({
                            conductPkModal: {
                                isShowJoinPkMask: false,
                                isShowJoinPkSuccess: false
                            }
                        });
                    }, 2 * 1000);

                } else {
                    // 提示用户错误
                    let _msg = res.data.msg;
                    // 参与失败提示
                    _that.setData({
                        conductPkModal: {
                            isShowJoinPkMask: true,
                            isShowJoinPkModal: false,
                            isShowJoinPkFail: true,
                            failMsg: _msg
                        }
                    });

                    // 提示消失
                    setTimeout(() => {
                        _that.setData({
                            conductPkModal: {
                                isShowJoinPkMask: false,
                                isShowJoinPkFail: false
                            }
                        });
                    }, 2 * 1000);
                }
            },
            (res) => {
                // do nothing
            }
        );
        console.log(e);
    }
    ,

    /**
     * 确认昨日积分收益
     */
    confirmYesterdayHistory: function () {
        AppManager.saveLoginDate()
        this.setData({
            isHideYesterdayModel: true
        });
    }
    ,

    /**
     * 确认新用户奖励积分
     */
    confirmAward: function () {
        this.setData({
            isNewUser: false
        });
    }
    ,

    /*
    获取feed流信息
     */
    getFeeds: function (message) {
        AppHttpHelper.getReqByUid(
            getFeedUrl,
            {},
            (res) => {
                console.log(res);
                var messageList = res.data.data;
                this.setData({
                    messageList: messageList
                });
                this.showFeeds();
            },
            (res) => {
                console.log(res);
            }
        );
    },

    /** 获取顶部Pk列表 */
    getHeadPk: function () {
        let _that = this;
        AppHttpHelper.getReqByUid(
            getHeadPKUrl,
            {},
            (res) => {
                console.log(res);
                let _headPKList = res.data.data;
                _that.setData({
                    headPKList: _headPKList
                });
            },
            (res) => {
                console.log(res);
            }
            );
    },

    /** 显示Feed，隔5秒显示一次，然后隐藏5秒，再显示 */
    showFeeds: function () {
        let _that = this;
        let _messageList = _that.data.messageList;
        let _feedsSize = _messageList.length;
        let _showIndex = Math.floor(Math.random() * _feedsSize);
        if(_feedsSize>0){
            _that.setData({
                currentFeed: _messageList[_showIndex],
                isShowFeed: true
            });
            // 5秒后隐藏feeds
            setTimeout(() => {
                _that.hideFeeds();
            }, 2 * 1000);
        }
    }
    ,

    /** 隐藏feed，过5秒之后再显示 */
    hideFeeds: function () {
        let _that = this;
        _that.setData({
            isShowFeed: false
        });
        // 5秒之后显示
        setTimeout(() => {
            _that.showFeeds();
        }, 3 * 1000);
    }
    ,

    /*
    获取弹框PK结果信息
    */
    getPkResult: function (uid) {
        let that = this;
        AppHttpHelper.getReqByUid(
            pkResultPopupUrl,
            {uid: uid},
            (res) => {
                console.log("弹窗！！！");
                let resultList = res.data.data;
                console.log('res' + resultList.length);
                console.log('result'+resultList);
                this.setData({
                    resultList: resultList
                });
            },
            (res) => {
                console.log(res);
            }
        );
    }
    ,

    /*
    提交弹窗确认结果
    */
    modalConfirm: function (e) {
        let uid = AppManager.getUid();
        var id = e.target.dataset.id;
        wx.request({
            url: readPopupUrl,
            method: 'PUT',
            dataType: 'json',
            header: {
                'uid': uid,
                'content-type': 'application/json'
            },
            data: {
                popup_id: id,
            },
            success: res => {
                let resultMsg = res.data.msg;
                let resultCode = res.data.code;
                if (resultCode === 200) {
                    console.log('已阅读');
                } else {
                    console.log('确定失败');
                }
            },
            fail: res => {
                console.log(res.data);
            }
        });
        // 隐藏信息弹窗
        this.setData({
            PK_isModalHide: true,
        });
        // 回到换购商城首页
        wx.navigateBack({
            url: '../index/index'
        });
    }
    ,
    /*
    每日邀请好友
    */
    goInviteFriends: function (invite_uid) {
        console.log('邀请人ID2222' + invite_uid);
        AppHttpHelper.postReqByUid(
            inviteUrl,
            {
                invite_uid: invite_uid,
            },
            (res) => {
                let resultCode = res.data.code;
                console.log(resultCode);
                if (resultCode === 200) {
                    console.log('邀请成功');
                } else {
                    console.log('邀请失败');
                }
            },
            (res) => {
                console.log(res)
            }
        );
        /*wx.request({
            url: inviteUrl,
            method: 'post',
            dataType: 'json',
            data: {
                uid: uid,
                invite_uid: invite_uid,
            },
            success: res => {
                let resultCode = res.data.code;
                console.log(resultCode);
                if (resultCode === 200) {
                    console.log('邀请成功');
                } else {
                    console.log('邀请失败');
                }
            },
            fail: res => {
                console.log(res.data);
            }
        });*/
    }
    ,

    /*
    获取头部用户信息
    */
    _getUserInfo:function() {
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

})
