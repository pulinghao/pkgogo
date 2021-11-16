// pages/comment/comment.js
import AppManager from "../../lib/AppManager";

const postCommentUrl = require('../../config.js').postCommentUrl;
const upLoadImgUrl = require('../../config.js').upLoadImgUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discussid:"",
    imageList:[],
    uploadImgs:"",
    cycleid:""

  },

  chooseImage: function () {
    //console.log("图片上传"+upLoadImgUrl);
    var that = this;
    var promiseArray = [];
    var imgsList = that.data.imageList;
    var _uid = AppManager.getUid()
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          imageList: tempFilePaths
        });
        var promiseArray = []
        for (let i = 0; i < tempFilePaths.length; i++) {
          var imgPath = tempFilePaths[i]
          var promise = that.onHandleUploadImgsFile(imgPath)
          promiseArray.push(promise)
        }

        Promise.all(promiseArray).then(res => {
          console.log(res);
          var uploadImgs = res.join(",");
          that.setData({
            uploadImgs: uploadImgs
          })
        })

      }
    })
    console.log("触发了吗")
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imageList;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imageList: imgs
    });
  },
  /**
   * 移动文本框焦点
   */
  bindInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  /*
  发表打卡评论
  */
  requestComment: function (e) {
    let uid = AppManager.getUid();
    var message = this.data.content;
    var discussid = this.data.discussid;
    if (message == '') {
      wx.showToast({
        icon: 'none',
        title: '您尚未输入任何内容哦~',
        duration: 3000
      });
    } else {
        wx.request({
          url: postCommentUrl,
          method: 'POST',
          dataType: 'json',
          header: {
            'uid': uid,
            'content-type': 'application/json'
          },
          data: {
            discussid: discussid,
            content: message,
            imgs: this.data.uploadImgs
          },
          success: res => {
            let resultMsg = res.data.msg;
            let resultCode = res.data.code;
            if (resultCode === 200) {
              console.log('评论成功');
              let comment = res.data.data;
              wx.showToast({
                icon: 'success',
                title: "评论成功",
                duration: 3000
              });

            } else {
              console.log("评论失败");
              console.log('code' + resultCode);
              console.log('resultMsg' + resultMsg);
              wx.showToast({
                icon: 'none',
                title: "服务繁忙！",
                duration: 3000
              });
            }
          },
          fail: res => {
            console.log(res.data);
          }
        });
        wx.navigateBack({
          url: '../up_clock/clockList'
        });
      // })

    }
  },
  /**
   * input:图片的本地路径数组
   * output: promise对象
   * 上傳圖片文件
   */
  onHandleUploadImgsFile: function (e) {
    wx.showLoading({
      title: '上传中...',
    })
    var _uid = AppManager.getUid()
    //var uploadImgs = ""
    // 初始化实例
    var imgsPath = e
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: upLoadImgUrl,
        filePath: imgsPath,
        name: 'file',
        success: res => {
          var result = JSON.parse(res.data);
          // uploadImgs = uploadImgs + "," + result.data.url;
          console.log("result.data.url" + result.data.path);
          //console.log("uploadImgs" + uploadImgs);
          resolve(result.data.path);
          wx.hideLoading()
        },
        fail: res => {
          console.log(res);
          reject()
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.discussid;
    var cycleid=options.cycleid;
    console.log("discussid" + id);
    this.setData({
      discussid: id,
      cycleid:cycleid
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

  }
})
