Component({
    /**
     * 组件的属性列表
     */
    properties: {
        leftText: String,
        rightText: String
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
      onClickYes:function(e){
        const eventOption = {
            bubbles: true,
            composed: true,
            capturePhase: false
        }
        this.triggerEvent('leftevent',e.detail, eventOption)
        console.log("trigger yes");
      },

      onClickNo:function(e){
        const eventOption = {
            bubbles: true,
            composed: true,
            capturePhase: false
        }
        this.triggerEvent('rightevent',e.detail, eventOption)
        console.log("trigger no");
      }
    }
  })