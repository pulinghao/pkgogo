// pages/up_clock/detail.js
import AppManager from "../../lib/AppManager";
import AppHttpHelper from "../../lib/AppHttpHelper";

const getClockDetail = require('../../config.js').getClockDetail;
const goLikeURL = require('../../config.js').goLikeURL;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: "",
        discussId:"",
        pageIndex:"",
        size:""
    },
    /*
    点赞
    */
    goLike: function (e) {
        let id = e.currentTarget.dataset['index'];
        let islike = e.currentTarget.dataset['mark'];
        let mark = 0;
        if(islike===false){
            mark=1;
        }
        else{
            mark=0;
        }
        let uid = AppManager.getUid();
        wx.request({
            url: goLikeURL,
            method: 'POST',
            dataType: 'json',
            header:{
                'uid':uid,
                'content-type': 'application/json'
            },
            data: {
                discussid:id,
                mark:mark,
            },
            success: res => {
                this.getClockDetail(this.data.discussId,this.data.pageIndex,this.data.size);
            },
            fail: res => {
                console.log(res.data);
            }
        });
    },
    /*
    获取打卡详情
    */
    getClockDetail: function (discussid,pageIndex,size) {
        wx.showLoading();
        console.log(pageIndex+"pageIndex");
        let that = this;
        var uid = AppManager.getUid();
        AppHttpHelper.getReqByUid(
            getClockDetail,
            {
                discussid: discussid,
                page:pageIndex,
                size:size
            },
            (res) => {
                console.log("成功");
                var data = res.data.data;
                console.log(data);
                that.setData({
                    dataList: data
                })
                wx.hideLoading()
                //this.getClockDetail(that.data.discussId,that.data.pageIndex,that.data.size);
            },
            (res) => {
                console.log(res);
            }
        );
        /*wx.request({
            url: getClockDetail,
            method: 'get',
            dataType: 'json',
            header: {
                'uid': uid,
                'content-type': 'application/json'
            },
            data: {
                discussid: discussid,
                page:pageIndex,
                size:size
            },
            success: res => {
                console.log("成功");
                var data = res.data.data;
                console.log(data);
                that.setData({
                    dataList: data
                })
                //this.getClockDetail(that.data.discussId,that.data.pageIndex,that.data.size);
            },
            fail: res => {
                console.log(res.data);
            }
        });*/
    },
    /*
    跳转到评论
    */
    goComment:function (e) {
        let discussid = e.currentTarget.dataset['index'];
        console.log("评论ID"+discussid);
        wx.navigateTo({
            url: '/pages/comment/comment?discussid=' + discussid,
        })
    },

    //预览图片
    previewImage: function (event) {
        var src = event.currentTarget.dataset.src;//获取data-src
        var imgList = event.currentTarget.dataset.list;//获取data-list
        console.log("预览图片"+imgList);
        wx.previewImage({
            current: src,
            urls: imgList
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("这里"+options.discussid);
       // this.getClockDetail(options.discussid,options.pageIndex,options.size);
        this.setData({
            discussId:options.discussid,
            pageIndex:options.pageIndex,
            size:options.size
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
        var that=this
        //this.getClockDetail(this.data.discussid,this.data.pageIndex,this.data.size);
        this.getClockDetail(that.data.discussId,that.data.pageIndex,that.data.size);
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

    }
})
