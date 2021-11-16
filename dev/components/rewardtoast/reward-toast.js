Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean,
    toastTitle: String,
    toastSubtitle: String
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    toastShow: function(title, subtitle) {
      let that = this;
      that.setData({
        isShow: true,
        toastTitle: title,
        toastSubtitle: subtitle
      });

      setTimeout(function() {
        that.setData({
          isShow: false
        });
      }, 2 * 1000);
    },
  }
})