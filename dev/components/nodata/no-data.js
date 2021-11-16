// components/nodata/no-data.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String

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
    goClock:function () {
      console.log("行动")
      wx.switchTab({
        url: '../../pages/index/index'
      })
    }
  }
})
