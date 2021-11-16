// pages/market/redemptiondetail.js
import AppManager from "../../lib/AppManager.js";

const redemptionRuleUrl = require("../../config.js").productUrl;
const buyUrl = require("../../config.js").buyUrl;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isModalHide: true,
        remark: ''
    },

    /**
     * 获取换购规则
     */
    getRedemptionRemark: function (productId) {
        let _uid = AppManager.getUid();
        var that = this;
        wx.request({
            url: redemptionRuleUrl,
            method: 'GET',
            data: {
                goodsid: productId
            },
            success: res => {
                //console.log(res);
                let remark = res.data.data.remark;
                //console.log(remark);
                that.setData({
                    remark: remark,
                    productId:productId
                });
            },
            fail: res => {
                console.log(res);
            }
        });
    },

    /**
     * 确认换购按钮监听
     */
    confirmRedemption: function (e) {
        let phoneNumber = e.detail.value.phoneNumber;
        let wechatId = e.detail.value.wechatId;
        let address = e.detail.value.address;
        let receivePhoneNumber = e.detail.value.receivePhoneNumber;
        let checkResult = this.checkUserInfo(phoneNumber, wechatId, address, receivePhoneNumber);
        if (checkResult === "") {
            // 数据校验没问题，上传用户数据，并弹窗提醒用户
            this.redemption(phoneNumber, wechatId, address, receivePhoneNumber);
        } else {
            // 提示用户某个数据有误
            wx.showToast({
                title: '库存不足',
                icon: 'none',
                duration: 2000
            });
        }

    },

    /**
     * 校验用户信息
     * 返回字符串为空：用户信息没问题；
     * 返回字符串不为空：字符串为校验失败原因。
     */
     checkUserInfo: function (phoneNumber, wechatId, address, receivePhoneNumber) {
       let result = "";
       // check 手机号
       let mobileReg = /^1\d{10}$/;
       let phoneResult = mobileReg.test(phoneNumber);
       let receivePhoneNumberResult = mobileReg.test(receivePhoneNumber);
       if (phoneResult==="") {
         return "请检查手机号";
       }
       if (receivePhoneNumberResult==="") {
         return "请检查收货电话";
       }
       // check 收货地址
       if (address === "") {
         return "请输入收货地址";
       }
       // check wechatId，wechatId 应该可以直接获取
       if (wechatId === "") {
         return "请输入微信号";
       }
       return result;
     },
    /**
     * 确认换购
     * 1. 上传用户信息
     * 2. 弹窗提示用户
     */
    redemption: function (phoneNumber, wechatId, address, receivePhoneNumber) {
        let uid = AppManager.getUid();
        var id = this.data.productId;
        var price = this.data.productPrice
        console.log('productId'+id);
        wx.request({
            url: buyUrl,
            method: 'POST',
            dataType: 'json',
            header:{
                'uid':uid,
                'content-type': 'application/json'
            },
            data: {
                good_id: id,
                tel_num: phoneNumber,
                wechat_num: wechatId,
                address: address,
                pick_tel_num: receivePhoneNumber
            },
            success: res => {
                let resultMsg = res.data.msg;
                let resultCode = res.data.code;
                if (resultCode === 200) {
                    console.log('换购成功');
                    // 弹窗提示用户换购成功
                    this.setData({
                        isModalHide: false
                    });
                    // 设置当前用户的积分
                    let oldTotalMoney = AppManager.getMoney();
                    let newTotalMoney = oldTotalMoney - price;
                    AppManager.saveMoney(newTotalMoney);
                    console.log('redemptiondetail', 'user total money is ' + newTotalMoney);
                } else {
                    // 购买失败
                    console.log('resultMsg'+resultMsg);
                    wx.showToast({
                        icon: 'none',
                        title: '库存不足',
                        duration: 3000
                    });
                }
            },
            fail: res => {
                console.log(res.data);
            }
        });
    },
    /**
     * 用户信息确认弹窗
     */
    modalConfirm: function () {
        // 隐藏信息弹窗
        this.setData({
            isModalHide: true
        });

        // 回到换购商城首页
        wx.navigateBack({
            url: '../market/market'
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getRedemptionRemark(options.id);
        console.log('option:' + options.id);
        console.log('price:' + options.price);
        this.data.productId=options.id;
        this.data.productPrice=options.price;
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

    }
});