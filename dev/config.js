/**
 * 小程序配置文件
 */
//
var host = "https://qbkjapi.wenxiaoda.com/qupk"
var qupkHome = "https://qbkjapi.wenxiaoda.com/qupkHome"
var qupkMy = "https://qbkjapi.wenxiaoda.com/qupkMy"
var qupkDetail = "https://qbkjapi.wenxiaoda.com/qupkDetail"
var qupkPunch = "https://qbkjapi.wenxiaoda.com/qupkPunch"
var common = "https://qbkjapi.wenxiaoda.com/common"

/*var host = "http://www.outiejun.cc:3030/qupk"
var qupkHome = "http://www.outiejun.cc:3030/qupkHome"
var qupkMy = "http://www.outiejun.cc:3030/qupkMy"
var qupkDetail = "http://www.outiejun.cc:3030/qupkDetail"
var qupkPunch = "http://www.outiejun.cc:3030/qupkPunch"
var common = "http://www.outiejun.cc:3030/common"*/
//http://192.168.1.110
//http://www.outiejun.cc:3030/swagger-ui.html
// var host = "https://qbkjapi.wenxiaoda.com/qupk"
// var host = "www.duanzi66.com/wenda"


// 使用mock数据打开下面的注释
// var mockHost = "dsn.apizza.net/mock/d44fcfb703d5b0ae0fc2b67ad3655e8e";
// host = mockHost;
var config = {

  // 下面的地址配合云端 Server 工作
  host,

    // 1.登录接口(qupk)
    loginUrl: `${host}/login`,

    // 2.首页--获取pk列表(qupkHome)
    getPKListUrl: `${qupkHome}/listPk`,

    // 3.PK详情页--获取详情(qupkDetail)
    getPKDetailUrl: `${qupkDetail}/`,

    // 4.PK详情页--参与PK详情页(qupkDetail)
    joinPKUrl: `${qupkDetail}/joinin`,

    // 5. 获取用户相关信息（qupk)
    usercenterUrl: `${host}/userInfo`,

    // 6.商城--获取商品列表（qupk)
    productListUrl: `${host}/listProduct`,

    // 7.商城--商品详情(qupk)
    productUrl: `${host}/product`,

    // 8.商城--商品购买（qupk)
    buyUrl: `${host}/buy`,

    // 9.更新用户信息（qupk）
    updateUserInfoUrl: `${host}/updateUserInfo`,

    // 10.获取积分详情 (qupkMy)
    pointsHistoryUrl: `${qupkMy}/moneyDetail`,

    /*
    1，前面10个接口是原本就配置了的，接口文档变更了的都已经改过来了
    2，删除了5个在接口文档上没有的接口
    3，后面10哥接口是根据接口文档新添加的
    */

    //11.提交表单的formid-用于发送微信模板消息（qupk)
    formIdUrl: `${host}/formid`,

    //12.弹框-获取pk参与结果的弹框（qupk)
    pkResultPopupUrl: `${host}/popup`,

    //13.弹框-确认阅读弹窗内容（qupk)
    readPopupUrl: `${host}/popup`,

    //14.首页-随机获取一条feed信息 (qupkHome)
    getFeedUrl: `${qupkHome}/getFeed`,

    //15.我的-我参与的PK页（qupkMy）
    getMyPk: `${qupkMy}/guessingRecord`,

    //16.我的-PK币兑换(qupkMy)
    getExchangeUrl: `${qupkMy}/exchange`,

    //17.我的-参与PK和每日分享的金币任务（qupkMy)
    shareUrl: `${qupkMy}/task/share`,

    //18.我的-邀请好友任务（qupkMy)
    inviteUrl: `${qupkMy}/task/invite`,

    //19.PK详情页-动态 (qupkDetail)
    getDynamicUrl: `${qupkDetail}/dynamic`,

    //20.PK详情页-说两句 (qupkDetail)
    sendMessageUrl: `${qupkDetail}/dynamic`,

    // 21.首页顶部的 pk 列表（横向的）
    getHeadPKUrl: `${qupkHome}/punch`,

    //22.获取打卡详情列表
    getClockList: `${qupkPunch}/detail`,

    //23.获取打卡时间
    getClockTime:`${qupkPunch}/discuss`,

    //24.获取打卡详情
  getClockDetail:`${qupkPunch}/discuss/detail`,

  //24.获取打卡排行榜
  getClockRanking:`${qupkPunch}/ranking`,

  //25.上传图片
  upLoadImgUrl:`${common}/uplaodImg`,

  //26.点赞
  goLikeURL:`${qupkPunch}/discuss/like`,

  //27.打卡评论
  postClockUrl:`${qupkPunch}/discuss`,

  //28.评论回复
  postCommentUrl:`${qupkPunch}/discuss/reply`,

  //29.获取我得打卡记录
  getMyHistoryUrl:`${qupkPunch}/my`,

  //30.确认参与本次打卡活动
  postSignUpUrl:`${qupkPunch}/signup`,

  //31.打卡成功或失败确认弹窗
  clockConfirmUrl:`${qupkPunch}/popupConfirm`,

  //32.首页获取用户打卡数据
  getClockRecordUrl:`${qupkHome}/punchContent`,

  //33.获取我的打卡记录
  getMyClockUrl: `${qupkMy}/punchRecord`,

};

module.exports = config
