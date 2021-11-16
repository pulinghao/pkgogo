// pages/myclock/myclock.js
import AppHttpHelper from "../../lib/AppHttpHelper";
import AppManager from "../../lib/AppManager";

const getMyHistoryUrl = require('../../config.js').getMyHistoryUrl;
const goLikeURL = require('../../config.js').goLikeURL;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        resultList: [],
        punchid:"",
        pageIndex: 1, //分页索引
        size: 5,   //每次分页拉多少个元素
    },

    getMyHistory: function (punchid,pageIndex, isFirst) {
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
            getMyHistoryUrl,
            {
                punchid:punchid,
                page: pageIndex,
                size: size
            },
            (res) => {
                var data = res.data.data;
                var dataList = [];
                if (isFirst === true) {
                    dataList = data;
                } else {
                    dataList = this.data.resultList.concat(data);
                }
                console.log("分页：" + pageIndex);
                that.setData({
                    pageIndex: pageIndex,
                    resultList: dataList,
                })
            },
            (res) => {
                console.log(res)
            }
        );

        /*if (isFirst === true) {
            pageIndex = 1;
        } else {
            pageIndex = pageIndex + 1;
        }
        console.log("pageIndex" + pageIndex)
        var clockList=[]
        AppHttpHelper.getReqByUid(
            getMyHistoryUrl, {
                page: pageIndex,
                size: size
            },
            (res) => {
                let result = res.data.data;
                var j=0
                for(let i = 0;i<result.length;i++){
                    if(result[i].punchid==that.data.punchid){
                        clockList[j++]=result[i]
                    }
                }
                that.setData({
                    resultList: clockList,
                })
            },
            (res) => {
                console.log(res)
            }
        );*/
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
                var resultList = this.data.resultList;
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
                    resultList: resultList
                })
                console.log("成功");
            },
            fail: res => {
                console.log(res.data);
            }
        });
    },

    onScrollToLower: function (e) {
        this.getMyHistory(this.data.punchid,this.data.pageIndex, false);
        console.log("是否触发" + e);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log("onload触发了")
        console.log("PK标题" + options.punchid);
        this.setData({
            punchid:options.punchid
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
        this.getMyHistory(this.data.punchid,this.data.pageIndex, true);
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
            title: "一起来打卡 ~",
            path: '/pages/up_clock/clocklist?id=' + this.data.punchid,
            /*imageUrl:'/images/bg_share.png',*/
        }
    }
})
