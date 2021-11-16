Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isVoted: Boolean,
        title: String,
        remark: String,
        leftText: String,
        leftPercent: Number,
        leftNum: Number,
        rightText: String,
        rightPercent: Number,
        rightNum: String,
        joinNum: Number,
        payMoney: Number,
        imgUrl: String,
        userOption: Number,
        result: Number,
        leftTotal: Number,
        rightTotal: Number,
        seal: Boolean,
        settle: Boolean,
        divideMoney: Number,
        end: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        isVoted: false
    }
})