// pages/up_clock/clocklist.js
import AppHttpHelper from "../../lib/AppHttpHelper";
import AppManager from "../../lib/AppManager";

var authLoginManager = require('../../template/authLogin/authLoginManager.js')
const getClockList = require('../../config.js').getClockList;
const goLikeURL = require('../../config.js').goLikeURL;
const postSignUpUrl = require('../../config.js').postSignUpUrl;
const clockConfirmUrl = require('../../config.js').clockConfirmUrl;
const formIdUrl = require('../../config.js').formIdUrl


Page({

    /**
     * 页面的初始数据
     */
    data: {
        punchid: "",
        clockList: [],
        headInfo: "",
        cycleid: "",
        clockImg: [],
        isShowBanner: false,
        isIphoneX: 0,
        iconM: 0,
        pageIndex: 1, //分页索引
        size: 5,   //每次分页拉多少个元素
        phoneHeight: "",
        isShowClock: true,
        isShowCoinLack: true,
        isShowSuccess: true,
        isShowFailure: true,
        isShowJoin: true,
        isShowButton:false,
        punchState: 0,
        cycleDate: "",
        poolMoney: "",
        sustainDay: "",
        head:"",
        username:"",
        isIndex:100,
        tabbar: {
            "color": "#999999",
            "borderStyle": "#dcdcdc",
            "backgroundColor": "#ffffff",
            "list": [{
                "key": "rank",
                "iconPath": "/images/icon_rank.png",
                "iconPathTwo": "/images/icon_rank.png",
                "selectedIconPath": "/images/icon_rank.png",
                "text": "排行榜",
                "textTwo": "排行榜",
                "textThree": "排行榜",
            },
                {
                    "key": "comment",
                    "iconPath": "/images/icon_da_ka.png",
                    "iconPathTwo": "",
                    "iconType": "big overflow circle shadow",
                    "text": "打卡",
                    "textTwo": "立即参与",
                    "textThree": "参与中",

                },
                {
                    "key": "myHistory",
                    "iconPath": "/images/icon_my_history.png",
                    "iconPathTwo": "/images/icon_my_history.png",
                    "selectedIconPath": "/images/icon_my_history.png",
                    "text": "我的记录",
                    "textTwo": "我的记录",
                    "textThree": "我的记录",
                }
            ]
        },
      item: {
        showLogin: false
      },
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
        this.getHenght();
        var that = this;
        //console.log("海报分享过来的"+options.post_id)
        var punchid = options.id;
        console.log("punchid"+punchid);
        var isIndex  = options.isIndex;
        if(isIndex!=""){
            this.setData({
                isIndex:isIndex
            })
        }
        console.log("isIndex"+isIndex);
        if(this.data.isIndex=="true"||this.data.isIndex==true){
            this.setData({
                isShowButton:true
            })
        }
        else {
            this.setData({
                isShowButton:false
            })
        }
        that.setData({
            punchid: punchid,
            isIndex:isIndex
        })
        var expiration = wx.getStorageSync("index_banner_expiration");
        if (expiration === null || expiration === "") {
            expiration = "0";
        }
        var expirationTime = parseInt(expiration);
        var timestamp = Date.parse(new Date());
        console.log("expirationTime=" + expirationTime + " timestamp=" + timestamp);
        if (expirationTime < timestamp) {
            this.setData({
                isShowBanner: false
            })
        } else {
            this.setData({
                isShowBanner: true
            })
        }

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
        this.getClockList(this.data.punchid, this.data.pageIndex, true);
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
            title: "一起加入" + this.data.headInfo.sub_title + '~',
            path: '/pages/up_clock/clocklist?id=' + this.data.punchid,
            /*imageUrl:'/images/bg_share.png',*/
        }

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

    tabChange: function (e) {
        var key = e.detail.key;
        var punchState = this.data.punchState;
        if (punchState == 1) {
            if (key == 'comment') {
                wx.navigateTo({
                    url: '/pages/comment/clock?punchid=' + this.data.punchid + '&isShowtextarea=false' + '&getMoney=' + this.data.headInfo.carveupMoney + "&cycleid=" + this.data.cycleid,
                })
            } else if (key == 'rank') {
                wx.navigateTo({
                    url: '/pages/rank/rank?punchid=' + this.data.punchid + '&pkTitle=' + this.data.headInfo.title,
                })
            } else if (key == 'myHistory') {
                wx.navigateTo({
                    url: '/pages/myclock/myclock?punchid=' + this.data.punchid,
                })
            }
        } else if (punchState == 2) {
            if (key == 'comment') {
                this.setData({
                    isShowClock: false
                })
            } else if (key == 'rank') {
                wx.navigateTo({
                    url: '/pages/rank/rank?punchid=' + this.data.punchid + '&pkTitle=' + this.data.headInfo.title,
                })
            } else if (key == 'myHistory') {
                wx.navigateTo({
                    url: '/pages/myclock/myclock?punchid=' + this.data.punchid,
                })
            }
        }else if(punchState==3){
            if (key == 'comment') {
                wx.showToast({
                    icon:"none",
                    title:"打卡周期开始后，再来打卡吧",
                    duration:2000
                })

            } else if (key == 'rank') {
                wx.navigateTo({
                    url: '/pages/rank/rank?punchid=' + this.data.punchid + '&pkTitle=' + this.data.headInfo.title,
                })
            } else if (key == 'myHistory') {
                wx.navigateTo({
                    url: '/pages/myclock/myclock?punchid=' + this.data.punchid,
                })
            }
        }
        else {
            if (key == 'comment') {
                wx.showToast({
                    icon:"none",
                    title:"你今天已经打过卡了~",
                    duration:2000
                })

            } else if (key == 'rank') {
                wx.navigateTo({
                    url: '/pages/rank/rank?punchid=' + this.data.punchid + '&pkTitle=' + this.data.headInfo.title,
                })
            } else if (key == 'myHistory') {
                wx.navigateTo({
                    url: '/pages/myclock/myclock?punchid=' + this.data.punchid,
                })
            }
        }
    },
    /*
    状态判断
    */
    stateEstimate: function (headInfo) {
        console.log("headInfo.isSuccess"+headInfo.isSuccess);
        if (headInfo.isSuccess == 1) {
            this.setData({
                isShowSuccess: false
            })
        }
        if (headInfo.isSuccess == 2) {
            this.setData({
                isShowFailure: false
            })
        }
        if (headInfo.isSignup == false) {
            this.setData({
                punchState: 2
                //立即参与
            })
        }
        if (headInfo.isSignup == true && headInfo.isAllowPunch == false) {
            this.setData({
                punchState: 3
                //参与中
            })
        }
        if (headInfo.isSignup == true && headInfo.isAllowPunch == true) {
            this.setData({
                punchState: 1
                //报名成功，允许打卡
            })
        }
        if (headInfo.isSignup == true && headInfo.isPunch == true) {
            this.setData({
                punchState: 4
                //当天打卡完
            })
        }
    },
    /*
    获取打卡PK详情列表
    */
    /*workPage:function(){

    },*/
    getClockList: function (punchid, pageIndex, isFirst) {
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
        getClockList,
        {
          punchid: punchid,
          page: pageIndex,
          size: size
        },
        (res) => {
          var headInfo = res.data.data;
            that.stateEstimate(headInfo);
            var cycleid = headInfo.cycleid;
            console.log("cycleid" + cycleid);
          var data = headInfo.discussList;
          var dataList = [];
          if (isFirst === true) {
            dataList = data;
          } else {
            dataList = this.data.clockList.concat(data);
          }
          console.log("分页：" + pageIndex);
          that.setData({
            pageIndex: pageIndex,
            headInfo: headInfo,
            clockList: dataList,
              cycleid: cycleid,
            //isPunch:headInfo.isPunch
          })
        },
        (res) => {
          console.log(res)
        }
      );
    },
    /*
    跳转到打卡详情页
    */
    goClockDetail: function (e) {
        let item = e.currentTarget.dataset.dayItems;
        console.log(item.id);
    },

    /**
     * 滑到最底端触发更新时间
     */
    onScrollToLower: function (e) {
        this.getClockList(this.data.punchid, this.data.pageIndex, false);
        console.log("是否触发" + e);
    },
    /*
    获取当前设备的高度
    */
    getHenght: function () {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                const model = res.model;
                const modelInclude = ["iPhone X", 'iPhone XR', "iPhone XS", "iPhone XS MAX"];
                var flag = false;//是否X以上机型
                for (let i = 0; i < modelInclude.length; i++) {
                    //模糊判断是否是modelInclude 中的机型,因为真机上测试显示的model机型信息比较长无法一一精确匹配
                    if (model.indexOf(modelInclude[i]) != -1) {
                        flag = true
                    }
                }
                if (flag) {
                    that.setData({
                        isIphoneX: 160,
                        iconM: 30,
                        side: 65
                    })
                } else {
                    that.setData({
                        isIphoneX: 98,
                        iconM: 25,
                        side: 5
                    })
                }
                console.log(res.windowWidth);
                console.log("当前设备高度" + res.windowHeight + "当前设备宽度" + res.windowWidth);
                that.setData({
                    phoneHeight: res.windowHeight
                })
            },
        })
    },
    /*
    跳转到评论
    */
    goComment: function (e) {
        let discussid = e.currentTarget.dataset['index'];
        var discussNum= e.currentTarget.dataset['item'];
        console.log("评论ID" + discussid);
        var cycleid=this.data.cycleid;
        console.log("cycleid"+cycleid);
        console.log("discussNum"+discussNum)
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
    删除banner
    */
    goDeleteBanner: function () {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp - timestamp % 86400000 - 8 * 60 * 60 * 1000;
        var expiration = timestamp + 86400000;
        console.log("hhhhhhhhhhhhhhhhhhhhhh" + timestamp + "," + expiration);
        wx.setStorageSync("index_banner_expiration", expiration);
        this.setData({
            isShowBanner: true
        })

    },

    /*
  * 用户授权相关
  */
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
    }
    ,
    //预览图片
    previewImage: function (event) {
        var src = event.currentTarget.dataset.src;//获取data-src
        var imgList = event.currentTarget.dataset.list;//获取data-list
        console.log("预览图片" + imgList);
        wx.previewImage({
            current: src,
            urls: imgList
        })
    },

    //回到首页
    gotoIndex:function(){
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    //取消参与打卡弹窗
    cancelJoin: function () {
        this.setData({
            isShowClock: true
        })
    },
    confirmJoin: function (e) {
        var formId = e.detail.formId;
        console.log("formId"+formId);
        AppHttpHelper.postReqByUid(
            postSignUpUrl,
            {
                id: this.data.cycleid
            },
            (res) => {
                if(res.data.code==404){
                    this.setData({
                        isShowClock: true,
                        isShowCoinLack: false
                    })
                }
                else {
                    AppHttpHelper.postReqByUid(
                        formIdUrl,
                        {
                            formid: formId
                        },
                        (res) => {
                        },
                        (res) => {
                            console.log(res.data);
                        }
                    );
                    var result = res.data.data;
                    this.setData({
                        isShowClock: true,
                        isShowJoin: false,
                        cycleDate: result.cycleDate,
                        poolMoney: result.poolMoney,
                        sustainDay: result.sustainDay,
                        head:result.head,
                        username:result.username
                    })
                }
            },
            (res) => {
                wx.showToast({
                    icon:"none",
                    title:"服务繁忙"
                })
            }
        );
    },
    cancelClock:function () {
        this.setData({
            isShowCoinLack:true
        })
    },
    gotoTask:function () {
        this.setData({
            isShowCoinLack:true
        })
        wx.navigateTo({
            url:"/pages/market/market"
        });
    },
    confirmJoinSuccess:function () {
        this.setData({
            isShowJoin:true
        })
        this.getClockList(this.data.punchid, this.data.pageIndex, true);
    },
    modalConfirm:function () {
        let uid = AppManager.getUid();
        wx.request({
            url: clockConfirmUrl,
            method: 'PUT',
            dataType: 'json',
            header: {
                'uid': uid,
                'content-type': 'application/json'
            },
            data: {
                id: this.data.cycleid,
            },
            success: res => {
                this.setData({
                    isShowFailure:true,
                    isShowSuccess:true
                })
            },
            fail: res => {
                console.log(res.data);
            }
        });
    }

})
