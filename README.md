# inwehub_weapp
微信小程序

[页面规范(每个页面都需要)]
1. 先引入pageOptions
    var pageOptions = require("../../utils/pageOptions.js")

2. 将Page的options用pageOptions包裹起来
    pageOptions.getOptions({原options})

[获取当前页面参数]
可通过this.queryObject获取
    如: this.data.queryObject.id

queryObject.scene值会自动分配到queryObject.id

[分享参数设置]
1. 如果需要设置当前页面的分享参数，data中设置以下内容
data: {
        autoShareCurPage: true,  // 自动设置当前分享参数
        autoShareParams: {
          title: 'demo'   // 当前分享的标题
        }
        ....
}

2. 如需动态更改分享标题
that.setData({
    autoShareParams: {
      title: data.name
    }
})