// pages/pk_detail/comment.js
import AppManager from "../../lib/AppManager";
const sendMessageUrl = require("../../config.js").sendMessageUrl;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pkId: 0,
        pkTitle: '',
        content: '',   //评论内容
        userName: '',
        userPhoto: ''
    },

    /**
     * 发送请求
     */
    requestComment: function (e) {
        let uid = AppManager.getUid();
        var message = this.data.content;
        var pkId = this.data.pkId;
        if(message=='')
        {
            wx.showToast({
                icon: 'none',
                title: '您尚未输入任何内容哦~',
                duration: 3000
            });
        }
        else {
            wx.request({
                url: sendMessageUrl,
                method: 'POST',
                dataType: 'json',
                header: {
                    'uid': uid,
                    'content-type': 'application/json'
                },
                data: {
                    pkid:pkId,
                    content:message
                },
                success: res => {
                    let resultMsg = res.data.msg;
                    let resultCode = res.data.code;
                    if (resultCode === 200) {
                        console.log('评论成功');
                        let commentList = res.data.data;
                        wx.showToast({
                            icon: 'success',
                            title: resultMsg,
                            duration: 3000
                        });
                    } else {
                        console.log("评论失败");
                        console.log('code'+resultCode);
                        console.log('resultMsg' + resultMsg);
                        wx.showToast({
                            icon: 'none',
                            title: resultMsg,
                            duration: 3000
                        });
                    }
                },
                fail: res => {
                    console.log(res.data);
                }
            });
            wx.navigateBack({
                url: '../pk_detail/competition'
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.pk_id
        let title = options.pk_title
        this.setData({
            pkId: id,
            pkTitle: title
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

    /**
     * 点击按钮
     */
    onClickSend: function () {
        this.requestComment()
    },

    /**
     * 移动文本框焦点
     */
    bindInput: function (e) {
        this.setData({
            content: e.detail.value
        })
    },

})