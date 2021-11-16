// pages/comment/clock.js
import AppManager from "../../lib/AppManager";
import AppHttpHelper from "../../lib/AppHttpHelper";

const getClockTime = require('../../config.js').getClockTime;
const upLoadImgUrl = require('../../config.js').upLoadImgUrl;
const postClockUrl = require('../../config.js').postClockUrl;
const formIdUrl = require('../../config.js').formIdUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        code: "E7AI98",
        inputValue: "",
        maskHidden: false,
        touxiang: "",
        title: "每日早起PK圈",
        clockTime: "",
        clockDay: "",
        clockDate: "",
        imageList: [],
        userName: "",
        moneyAdd: "",
        content: "",
        contiDay: "",
        punchid: "",
        qrCodeUrl: "",
        post_qrCodeUrl: "",
        isFirst: "",
        imgs: "",
        imagePath: "",
        phoneWidth: "",
        phoneHeight: "",
        continueNum: "",
        post_content: "",
        isShowtextarea: false,
        clockTitle: "",
        isShowToast: false,
        getMoney: "",
        uploadImgs: "",
        pics: [],
        preImg: [],
        label: false,
        cycleid:""
    },

    //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
    createNewImg: function () {
        var punchid = this.data.punchid;
        if (punchid == 1) {
            var bgImg = "/images/bg_post_up.png"
        } else {
            var bgImg = "/images/bg_post_run.png"
        }
        var height = this.data.phoneHeight;
        var width = this.data.phoneWidth
        console.log("高度宽度" + height + "," + width);
        var that = this;
        var context = wx.createCanvasContext('mycanvas');
        /*    context.setFillStyle("#ffe200")
            context.fillRect(0, 0, context.width, context.height);*/
        var path = "/images/bg_canvas.png";
        context.drawImage(bgImg, 0, 0, context.width, context.height);
        //绘制时间背景图
        /* var timeBg = "/images/bg_canvas_time.png";
         context.drawImage(timeBg, 8, 180, 326, 124);*/
        //绘制时间时刻
        var time_clock = this.data.clockTime;
        context.font = "50px Arial";
        context.setFillStyle('#FFFFFF');
        context.setTextAlign('center');
        context.fillText(time_clock, 100, 238);
        context.stroke();
        //绘制竖线
        context.beginPath();
        context.moveTo(180, 200);
        context.lineTo(180, 240);
        context.lineWidth = 0.6;
        context.strokeStyle = '#6ECCE2';
        context.stroke();
        //绘制星期几
        var time_day = this.data.clockDay;
        context.font = "16px Arial";
        context.setFillStyle('#FFFFFF');
        //context.setTextAlign('center');
        context.fillText(time_day, 224, 215);
        context.stroke();
        //绘制具体日期
        var time_date = this.data.clockDate;
        context.font = "16px Arial";
        context.setFillStyle('#FFFFFF');
        context.setTextAlign('center');
        context.fillText(time_date, 250, 238);
        //绘制“连续打卡”
        context.font = "18px Arial";
        context.setFillStyle('#28839A');
        context.setTextAlign('center');
        context.fillText("连续打卡", 140, 285);
        context.font = "18px Arial";
        context.setFillStyle('#28839A');
        context.setTextAlign('center');
        context.fillText("第", 195, 285);
        var continueNum = this.data.continueNum;
        context.font = "25px Arial";
        context.setFillStyle('#FF6600');
        context.setTextAlign('center');
        context.fillText(continueNum, 215, 285);
        context.font = "18px Arial";
        context.setFillStyle('#28839A');
        context.setTextAlign('center');
        context.fillText("天", 235, 285);
        //绘制文字背景
        /* var timeBg = "/images/bg_canvas_text.png";
         context.drawImage(timeBg, 10, 330, 320, 119);*/
        //绘制横线
        context.beginPath();
        context.moveTo(20, 365);
        context.lineTo(320, 365);
        context.moveTo(20, 400);
        context.lineTo(320, 400);
        context.moveTo(20, 435);
        context.lineTo(320, 435);
        context.lineWidth = 0.1;
        context.strokeStyle = '#C5DEE4';
        context.stroke();
        //绘制文字
        var text = this.data.post_content;
        var post_content = "“" + text + "”"
        context.font = "16px Arial";
        context.setFillStyle('#28839A');
        context.setTextAlign("left");
        this.textPrewrap(context, post_content, 20, 360, 33, 280, 2);
        //绘制用户昵称
        var username = this.data.userName;
        //var username="娃儿"
        var result = "—— " + username;
        context.font = "16px Arial";
        context.setFillStyle('#28839A');
        context.setTextAlign('right');
        //var measure = context.measureText(username);
        context.fillText(result, 318, 430);
        //绘制底部的PK币
        var pk = "连续打卡瓜分PK币";
        context.font = "16px Arial";
        context.setFillStyle('#323232');
        context.setTextAlign('center');
        context.fillText(pk, 80, 550);
        context.stroke();
        /*var coin = "+" + this.data.moneyAdd;
        context.font = "bold 20px Arial";
        context.setFillStyle('#FF4300');
        context.setTextAlign('center');
        context.fillText(coin, 90, 550);
        context.stroke();*/
        //绘制"长按二维码一趣Pk"
        var text1 = "长按二维码";
        var text2 = "一起趣PK";
        context.font = "16px Arial";
        context.setFillStyle('#323232');
        context.setTextAlign('center');
        context.fillText(text1, 210, 525);
        context.fillText(text2, 210, 550);
        context.stroke();
        /*//绘制上升图标
        var upimg = "/images/icon_up.png";
        context.drawImage(upimg, 120, 533, 8, 16);*/
        //绘制二维码
        var qrCodeUrl = this.data.post_qrCodeUrl;
        context.drawImage(qrCodeUrl, 255, 480, 70, 70);
        context.draw();
        setTimeout(function () {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function (res) {
                    wx.hideLoading();
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        imagePath: tempFilePath,
                        canvasHidden: true,
                        isShowtextarea: true,
                        //isShowToast:true
                    });
                },
                fail: function (res) {
                    console.log(res);
                }
            }, that);
        }, 200);
    },
    // 文字自动换行
    textPrewrap: function (ctx, content, drawX, drawY, lineHeight, lineMaxWidth, lineNum) {
        var drawTxt = ''; // 当前绘制的内容
        var drawLine = 1; // 第几行开始绘制
        var drawIndex = 0; // 当前绘制内容的索引

        // 判断内容是否可以一行绘制完毕
        if (ctx.measureText(content).width <= lineMaxWidth) {
            //var textMeasure = ctx.measureText(content);
            ctx.fillText(content.substring(drawIndex, i), drawX, drawY);
        } else {
            for (var i = 0; i < content.length; i++) {
                drawTxt += content[i];
                if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
                    if (drawLine >= lineNum) {
                        ctx.fillText(content.substring(drawIndex, i) + '...”', drawX, drawY);
                        break;
                    } else {
                        ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
                        drawIndex = i + 1;
                        drawLine += 1;
                        drawY += lineHeight;
                        drawTxt = '';
                    }
                } else {
                    // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
                    if (i === content.length - 1) {
                        ctx.fillText(content.substring(drawIndex), drawX, drawY);
                    }
                }
            }
        }
    },

    //点击保存到相册
    save: function () {
        var that = this
        wx.saveImageToPhotosAlbum({
            filePath: that.data.imagePath,
            success(res) {
                wx.showModal({
                    content: '图片已保存到相册',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            /* 该隐藏的隐藏 */
                            that.setData({
                                maskHidden: false
                            })
                            wx.navigateBack({
                                url: '../up_clock/clockList'
                            });

                        }
                    },
                    fail: function (res) {
                        console.log(11111)
                    }
                })
            }
        })
    },
    //点击隐藏海报
    hidden: function () {
        var that = this
        that.setData({
            maskHidden: false
        })
        wx.navigateBack({
            url: '../up_clock/clockList'
        });
    },
    //点击生成
    formSubmit: function (e) {
        var that = this;
        this.setData({
            maskHidden: false
        });
        that.setData({
            isShowToast: true
        })
        setTimeout(function () {
            that.setData({
                isShowToast: false
            })
        }, 2000)
        /* wx.showLoading({
             title: '生成中...',
             icon: 'loading',
             duration: 1000
         });*/
        setTimeout(function () {
            that.createNewImg();
            that.setData({
                maskHidden: true
            });
        }, 2000)
    },

    //上传图片
    upload: function () {
        var label = this.data.label;
        var that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.showLoading({
                    title: '图片上传中...',
                    icon: 'loading',
                })
                var imgs = res.tempFilePaths;
                that.setData({
                    imageList: imgs
                })
                var list = that.data.pics;
                var preimage = that.data.preImg;
                console.log("这里")
                for (var i in imgs) {
                    wx.uploadFile({
                        url: upLoadImgUrl, //接口
                        filePath: imgs[i],
                        name: 'file',
                        success: function (res) {
                            wx.hideLoading();
                            console.log("上传成功")
                            let json = JSON.parse(res.data)
                            let data = json.data
                            console.log(data.path);
                            list.push(data.path)
                            preimage.push(data.url)
                            if (list.length > 9 && preimage.length > 9) {
                                wx.showToast({
                                    title: '最多只能添加9张图',
                                    duration: 2000
                                })
                            } else {
                                that.setData({
                                    pics: list,
                                    preImg: preimage
                                })
                            }
                        }
                    })
                }
                wx.hideLoading();
            }
        })
        that.setData({
            label: true
        })

    },
    //图片上传
    chooseImage: function () {
        //console.log("图片上传"+upLoadImgUrl);
        var label = this.data.label
        var that = this;
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
                    wx.showLoading({
                        title: '上传中...',
                    })
                    var promise = that.onHandleUploadImgsFile(imgPath)
                    promiseArray.push(promise)
                }

                Promise.all(promiseArray).then(res => {
                    wx.hideLoading();
                    console.log(res);
                    var uploadImgs = res.join(",");
                    that.setData({
                        uploadImgs: uploadImgs,
                        label: true
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
    获取打卡时间
    */
    setDeadline: function (timestamp) {
        let time = new Date(timestamp * 1000);
        let hour = time.getHours();
        let originMinutes = time.getMinutes();
        let minutes = originMinutes > 10 ? originMinutes : '0' + originMinutes;
        let timeResult = hour + ":" + minutes;
        var bigDay = "";
        if (time.getDay() == 1) {
            bigDay = "一"
        } else if (time.getDay() == 2) {
            bigDay = "二"
        } else if (time.getDay() == 3) {
            bigDay = "三"
        } else if (time.getDay() == 4) {
            bigDay = "四"
        } else if (time.getDay() == 5) {
            bigDay = "五"
        } else if (time.getDay() == 6) {
            bigDay = "六"
        } else {
            bigDay = "七"
        }
        let day = "星期" + bigDay;
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        console.log("现在是几月" + month);
        let ri = time.getDate();
        let date = year + "年" + month + "月" + ri + "日";
        console.log(timestamp);
        console.log("timeResult: " + timeResult);
        this.setData({
            clockTime: timeResult,
            clockDay: day,
            clockDate: date,
        });
    },
    getClockTime: function (punchid) {
        //console.log("!!!!!!!!!" + punchid);
        let that = this;
        var uid = AppManager.getUid();
        AppHttpHelper.getReqByUid(
            getClockTime,
            {
                punchid: punchid,
                cycleid:that.data.cycleid
            },
            (res) => {
                var data = res.data.data;
                var contiDay = data.continueNum;
                //console.log(data.time);
                that.setDeadline(data.time);
                that.setData({
                    clockTitle: data.title,
                    contiDay: contiDay
                })
            },
            (res) => {
                console.log(res);
            }
        );
    },

    /*
    发表打卡评论
    */
    requestComment: function (e) {
        var label = this.data.label;
        let uid = AppManager.getUid();
        var message = this.data.content;
        var punchid = this.data.punchid;
        var imgsList = this.data.imageList;
        var uploadImgs = this.data.uploadImgs;
        var formId = e.detail.formId;
        if ((message === '') && (imgsList.length === 0)) {
            wx.showToast({
                icon: 'none',
                title: '您尚未输入任何内容哦~',
                duration: 3000
            });
        } else {
            if (label === true || imgsList.length === 0) {
                if (message == "") {
                    message = "分享图片"
                }
                //this.formSubmit();
                wx.request({
                    url: postClockUrl,
                    method: 'POST',
                    dataType: 'json',
                    header: {
                        'uid': uid,
                        'content-type': 'application/json'
                    },
                    data: {
                        punchid: punchid,
                        content: message,
                        imgs: uploadImgs,
                        cycleid:this.data.cycleid
                    },
                    success: res => {
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
                        let resultMsg = res.data.msg;
                        let resultCode = res.data.code;
                        if (resultCode === 200) {
                            let comment = res.data.data;
                            this.setDeadline(comment.timestamp);
                            this.setData({
                                post_content: comment.content,
                                userName: comment.name,
                                moneyAdd: comment.moneyAdd,
                                qrCodeUrl: comment.qrCodeUrl,
                                isFirst: comment.isFirst,
                                continueNum: comment.continueNum
                            })
                            let that = this;
                            wx.getImageInfo({
                                src: that.data.qrCodeUrl,
                                success(res) {
                                    var filePath = res.path
                                    that.setData({
                                        post_qrCodeUrl: filePath
                                    })
                                }
                            },this);
                            this.formSubmit();
                        } else {
                            wx.showToast({
                                icon: 'none',
                                title: "服务繁忙",
                                duration: 2000
                            });
                        }
                    },
                    fail: res => {
                        console.log(res.data);
                    }
                });
            } else {
                wx.showToast({
                    title: "图片上传中",
                    icon: "none",
                    duration: 2000
                })
            }
        }
    },

    /**
     * input:图片的本地路径数组
     * output: promise对象
     * 上傳圖片文件
     */
    onHandleUploadImgsFile: function (e) {
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
                    resolve(result.data.path)
                },
                fail: res => {
                    console.log(res);
                    reject()
                }
            })
        })
    }

    ,

    /*
    获取当前设备的高度
    */
    getHeight: function () {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                console.log(res.windowWidth);
                console.log("当前设备高度" + res.windowHeight);
                that.setData({
                    phoneHeight: res.windowHeight * 2,
                    phoneWidth: res.windowWidth * 2
                })
            },
        })
    }
    ,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.punchid;
        var isShowtextarea = options.isShowtextarea
        var cycleid=options.cycleid;
        //console.log("!!!!!!!!!!!" + id);
        this.getClockTime(id);
        this.getHeight();
        this.setData({
            punchid: id,
            cycleid:cycleid,
            //isShowtextarea:isShowtextarea
            getMoney: options.getMoney
        })
    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        console.log("海报分享" + this.data.punchid);
        return {
            path: '/pages/up_clock/clocklist?id=' + this.data.punchid,
            /*imageUrl:'/images/bg_share.png',*/
        }

    }
})
