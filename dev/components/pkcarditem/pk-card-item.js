Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    remainingTime: String, // 剩余时间
    deadline: String, // 截止/封盘时间
  },

  lifetimes: {
    attached() {
      // 初始化
      this._init();
    }
  },

  methods: {
    _init() {
      let _deadlineTimestamp = this.data.itemData.sealTime * 1000;
      this._setDeadline(_deadlineTimestamp);
      this._setRemainingTime(_deadlineTimestamp);
    },

    /** 将时间戳转化为 【6月11日 16：00】的样式 */
    _setDeadline(timestamp) {
      let time = new Date(timestamp);
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let hour = time.getHours();
      let originMinutes = time.getMinutes();F
      let minutes = originMinutes > 10 ? originMinutes : '0' + originMinutes;
      let timeResult = "PK截止时间 " + month + "月" + day + "日 " + hour + ":" + minutes;
      console.log("timestamp: " + timestamp + "timeResult: " + timeResult);
      this.setData({
        deadline: timeResult
      });
    },

    /** 根据 deadline 计算剩余时间，精确到秒 */
    _setRemainingTime(timestamp) {
      let currentTime = Date.parse(new Date());
      let _remainingTime;
      if (timestamp - currentTime < 0) {
        // 比赛已封盘
        let item = this.data.itemData;
        let seal = item.seal; // 是否封盘
        let settle = item.settle // 是否结束
        if (settle) {
          _remainingTime = "胜负已分出";
        } else {
          // 已封盘，但是还未结束
          _remainingTime = "已封盘，结果待公布";
        }
        // 已封盘，结果待公布
      } else {
        // 比赛封盘
        let dateSpan = timestamp - currentTime;
        // console.log("remaining timestamp: " + dateSpan);
        // 计算相差天数
        let days = Math.floor(dateSpan / (24 * 3600 * 1000));
        // 计算相差小时数
        let leave1 = dateSpan % (24 * 3600 * 1000);
        let hours = Math.floor(leave1 / (3600 * 1000));
        // 计算相差分钟数
        let leave2 = Math.floor(leave1 % (3600 * 1000));
        let munites = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000);
        var seconds = Math.round(leave3 / 1000);
        _remainingTime = days + "天" + hours + "小时" + munites + "分" + seconds + "秒";

        // 重复计算
        setTimeout(() => {
          let _deadlineTimestamp = this.data.itemData.sealTime * 1000;
          this._setRemainingTime(_deadlineTimestamp);
        }, 1 * 1000);
      }
      // console.log(_remainingTime);
      // 设置剩余时间或其它文案提示
      this.setData({
        remainingTime: _remainingTime
      });
    },

    goDetailPage: function(e) {
      let item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '../pk_detail/competition?id=' + item.id + '&isFromShare=0'+'&isIndex=true', //0表示普通页面进入
      })
    },
  }
})
