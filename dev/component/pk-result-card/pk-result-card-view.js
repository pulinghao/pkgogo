// component/pk-result-card/pk-result-card-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    remark:String,
    money:Number,
    people:Number,
    win:String,
    item:Object
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
    onClickDetail: function (e) {
      const eventOption = {
        bubbles: true,
        composed: true,
        capturePhase: false
      }
      this.triggerEvent('onclickdetail', e)
    },
  }
})
