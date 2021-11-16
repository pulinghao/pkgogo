// components/votebar/votebar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasVote:Boolean,
    ifSeal:Boolean,    //是否封盘
    ifSettle:Boolean,  //是否结算 
    leftBtnStr:String,
    rightBtnStr:String,
    leftText:String,
    leftPercent:Number,
    rightText:String,
    rightPercent:Number,
    votedText:String,
    compResult:Number,  //比赛结果
    userOptionIndex:Number,   //用户选择
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickYes: function (e) {
      const eventOption = {
        bubbles: true,
        composed: true,
        capturePhase: false
      }
      this.triggerEvent('leftevent', e.detail, eventOption)
    },

    onClickNo: function (e) {
      const eventOption = {
        bubbles: true,
        composed: true,
        capturePhase: false
      }
      this.triggerEvent('rightevent', e.detail, eventOption)
    }
  }
})
