// pages/pk_detail/competition.js

import AppManager from "../../lib/AppManager.js"
import AppHttpHelper from "../../lib/AppHttpHelper.js"
var authLoginManager = require('../../template/authLogin/authLoginManager.js')
// 获取pk详情
const getPKDetailUrl = require("../../config.js").getPKDetailUrl
// 参与投票url
const joinPKUrl = require('../../config.js').joinPKUrl
const formIdUrl = require('../../config.js').formIdUrl
//获取评论列表
const getDynamicUrl = require("../../config.js").getDynamicUrl;
const shareUrl = require('../../config.js').shareUrl;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        votebar: {
            hasVote: false,
        },
        hidden: true, //展示弹框
        show_chosen_toast: true, //展示选择
        vote_ok: false,
        pk_id: 0,
        isModalHide:true,
        isShowButton:false,
        isIndex:100,
        pk_info: {
            title: '',
            subtitle: '',
            img: '',
            pool_money: 0,
            pool_money_array: [],
            join_num: 0,
            option1: '',  //选项1
            option1Num: 0, //选项1的人数
            option2: '',  //选项2
            option2Num: '', //选项2的人数
            userJoinIn: false, //用户是否加入
            pay_money: 0,   //费用
            userOption: 0,  //用户的选择
            compResult: 0,   //比赛结果 0表示还没有结果
            userOptionIndex: 0, //用户选择，默认为0
        },
        seal: false,    //是否封盘
        settle: false,  //结算
        dd_timestamp: 0, //截止日期时间戳
        dd_time_count: '', //倒计时
        choose_index: 0,  //用户未选择为0
        choose_content: '',  //选项内容
        /*commentLlist:[]*/
        isShowToast:false,
      item: {
        showLogin: false
      },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _id = options.id
        let isFromShare = options.isFromShare
        let shareid = ''
        let uid = AppManager.getUid();
        var isIndex=options.isIndex;
        if(isIndex!=""){
            this.setData({
                isIndex:isIndex
            })
        }
        console.log("isIndex"+isIndex);
        if(this.data.isIndex=="true"||this.data.isIndex==true){
            this.setData({
                isShowButton:true,
            })
        }
        if (isFromShare != 0) {
            shareid = options.shareid
        }
        this.setData({
            pk_id: _id
        });
        this.requestDetail(_id, shareid);
    },

    //回到首页
    gotoIndex:function(){
        wx.switchTab({
            url: '/pages/index/index'
        })
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
        let uid = AppManager.getUid();
        this.getComments(uid,this.data.pk_id);
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
        let uid = AppManager.getUid();
        AppHttpHelper.postReqByUid(
            shareUrl,
            {
                share_uid: 1,
            },
            (res) => {
                let resultCode = res.data.code;
                console.log('!!!!!!'+res.data.msg);
                console.log(resultCode+'resultCode');
                if(resultCode===200){
                    setTimeout(() => {
                        this.setData({
                            isShowToast:true
                        })
                    }, 3 * 1000);
                }
                else {
                    setTimeout(() => {
                        wx.showToast({
                            icon: 'none',
                            title: '您已参加过此任务',
                            duration: 3000
                        });
                    }, 3 * 1000);
                }
            },
            (res) => {
                console.log(res)
            }
        );
        setTimeout(() => {
            this.setData({
                isShowToast:false
            })
        }, 2 * 1000);
        /*console.log('this.data.isShare'+this.data.isShareOK);*/
        return {
            title:this.data.pk_info.title+'!',
            path:'/pages/pk_detail/competition?id='+this.data.pk_id+'&share_uid='+uid,
            /*imageUrl:'/images/bg_share.png',*/
        }
    },


    /**
     * 数据请求,刷新当前页面
     */
    requestDetail: function (pk_id, sharer_id) {
        var that = this
        AppHttpHelper.getReqByUid(
            getPKDetailUrl, {
                pkid: pk_id,
            },
            (res) => {
                console.log(res)
                var data = res.data.data
                var pool_money_array = that.convertNumToArray(data.poolMoney)
                var userHasJoin = data.userJoinin
                var userOptionIndex = data.userOption == null ? 0 : data.userOption
                var userOption = ''

                let settle = data.settle
                let result = data.result
                if(settle == true){
                  if(result == 1){
                    userOption = '获胜方： ' + data.option1
                  } else{
                    userOption = '获胜方： ' + data.option2
                  }
                } else{
                  if (userOptionIndex == 1) {
                    userOption = '您已投入' + data.option1
                  } else if (userOptionIndex == 2) {
                    userOption = '您已投入' + data.option2
                  } else {
                    userOption = ''
                  }
                }


                var total = data.option1Num + data.option2Num
                var leftPer = 0
                var rightPer = 0
                if (total == 0) {
                    leftPer = 0
                    rightPer = 0
                } else {
                    leftPer = data.option1Num * 1.0 / total
                    rightPer = data.option2Num * 1.0 / total
                    leftPer = leftPer.toFixed(2) * 100
                    rightPer = rightPer.toFixed(2) * 100
                }

                that.setData({
                    pk_info: {
                        id:data.id,
                        title: data.title,
                        subtitle: data.remark,
                        pool_money: data.poolMoney,
                        pool_money_array: pool_money_array,
                        join_num: data.joinNum,
                        img: data.img,
                        //data.money_end_time,
                        option1: data.option1,
                        option1Num: data.option1Num,
                        option1Per: leftPer, //各自的百分比
                        option2: data.option2,
                        option2Num: data.option2Num,
                        option2Per: rightPer,
                        userJoinIn: data.userJoinin,
                        pay_money: data.payMoney,
                        userOption: userOption,
                        userOptionIndex: userOptionIndex,
                        compResult: data.result == null ? 0 : data.result,

                    },
                    seal: data.seal,
                    settle: data.settle,
                    dd_timestamp: data.sealTime,
                })

                that.countDown()

            },
            (res) => {
                console.log(res)
            }
        )

    },

    // 点击左边投票
    onVoteForLeft: function (e) {
        var that = this
        that.setData({
            hidden: false,
            choose_index: 1,
            choose_content: that.data.pk_info.option1
        })
    },

    // 点击右边投票
    onVoteForRight: function (e) {
        var that = this
        that.setData({
            hidden: false,
            choose_index: 2,
            choose_content: that.data.pk_info.option2
        })
    },

    // 取消投票
    onClickCancel: function (e) {
        let _that = this;
        _that.setData({
            hidden: true,
            choose_index: 0,
            choose_content: ''
        });
    },

    //取消金币弹框
    onClickCancelToast:function(e){
        let that = this;
        that.setData({
            isShowToast:false
        })
    },


    //确认投票
    onClickConfirm: function (e) {
        let auth = AppManager.checkHasAuth()

        if(!auth){
          wx.showToast({
            title: '请先授权',
            duration:2000
          })
          return
        }
        var that = this
        var option = this.data.choose_index
        var pk_id = this.data.pk_id
        var uid = AppManager.getUid();
        var formId = e.detail.formId;
        AppHttpHelper.postReqByUid(
            joinPKUrl,
            {
                option: option,
                pkid: pk_id
            },
            (res) => {
                var msg = res.data.msg
                if (msg == 'success') {
                    that.setData({
                        show_chosen_toast: false,
                        vote_ok: true
                    })

                    setTimeout(() => {
                        that.setData({
                            hidden: true
                        });
                    }, 2 * 1000);
                    var shareid = 0
                    that.requestDetail(pk_id, shareid)
                    that.getComments(uid,pk_id)
                    console.log(res)
                    console.log('join ok')
                } else {
                    that.setData({
                        show_chosen_toast: false,
                        vote_ok: false
                    })

                    setTimeout(() => {
                        that.setData({
                            hidden: true
                        });
                    }, 2 * 1000);
                }
            },
            (res) => {
                console.log(res)
                console.log('join fail')
            }
        );
        wx.request({
            url: formIdUrl,
            method: 'post',
            dataType: 'json',
            header: {
                'uid': uid,
                'content-type': 'application/json'
            },
            data: {
                formid: formId,
            },
            success: res => {
            },
            fail: res => {
                console.log(res.data);
            }
        });
    },

    // 数字转为数组
    convertNumToArray: function (e) {
        var numStr = e.toString()
        var strarray = numStr.split('')
        return strarray
    },


    countDown: function (e) { //倒计时函数
        var that = this
        // 获取当前时间，同时得到活动结束时间数组
        let newTime = new Date().getTime();
        // 对结束时间进行处理渲染到页面
        let endTime = this.data.dd_timestamp * 1000;
        let obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
                day: that.timeFormat(day),
                hou: that.timeFormat(hou),
                min: that.timeFormat(min),
                sec: that.timeFormat(sec)
            }
        } else { //活动已结束，全部设置为'00'
            obj = {
                day: '0',
                hou: '0',
                min: '0',
                sec: '0'
            }
        }
        // 渲染，然后每隔一秒执行一次倒计时函数
        var timestr =
            obj.day + "天"
            + obj.hou + "小时"
            + obj.min + "分钟"
            + obj.sec + "秒"
        this.setData({
            dd_time_count: timestr, //倒计时
        })
        setTimeout(this.countDown, 1000);
    },

    timeFormat: function (param) {//小于10的格式化函数
        return param < 10 ? param : param;
    },

    /*
    * 进入评论页面
    */
    onClickComment: function (e) {
        wx.navigateTo({
            url: 'comment?pk_id=' + this.data.pk_id + '&pk_title=' + this.data.pk_info.title,
        })
    },

    /**
     * 获取评论内容
     */

    getComments: function (uid,pkid) {
        let that = this;
        AppHttpHelper.getReqByUid(
            getDynamicUrl,
            {uid:uid,pkid:pkid},
            (res) => {
                console.log(res);
                let result = res.data.data;
                /*var commentList=[];
                for(var i = 0;i<5;i++)
                {
                    commentList[i]=result[i];
                }*/
                console.log('评论data',result);
                that.setData({
                    commentLlist: result,
                });
            },
            (res) => {
                console.log(res);
            }
        );
    },
  /*
   评论区滑到最底端,刷新评论区内容
  */
  onScrollToLower:function(e){
    let uid = AppManager.getUid();
    this.getComments(uid, this.data.pk_id);
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


})
