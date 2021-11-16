Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: Object,
    isNoMore: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    isNoMore: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetailPage: function(e) {
      let item = e.currentTarget.dataset.item;
      let isIndex=true;
      console.log("click pk header item, pk id is: " + item.id);
      wx.navigateTo({
        url: '../../pages/up_clock/clocklist?id=' + item.id+'&isIndex='+isIndex, //0表示普通页面进入
      })
    }
  }
})
