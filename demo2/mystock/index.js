var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数

  

  deleteStock:function(e){
    var that=this;
    var id=e.currentTarget.id;
    var index = parseInt(e.currentTarget.dataset.index);
    var stocks=that.data.mystocks;
    stocks.splice(index,1)
    // console.log(index);
    // console.log(stocks);
    wx:wx.request({
      url: getApp().globalData.ip +'/deletestock',
      data: {
        "stockcode":id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        // wx.setStorageSync("num",that.data.num-1);
        
        // wx.setStorageSync("mystocks", stocks)
        that.setData({
          num:that.data.num-1,
          mystocks:stocks
        })
        
      },
    })
  },
  jumpToStock: function (e) {
    var id = e.detail.value;
    // console.log('../singleStock/singlestock?id='+id);
    wx.navigateTo({
      url: '../singleStock/singlestock?id=' + id,
    })
  },

  jumpByTap: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../singleStock/singlestock?id=' + id,
    });
    // console.log(id);
  },

  onLoad: function () {
    // console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });

  },

  onShow:function(){
    var that=this;
    wx.request({
      url: getApp().globalData.ip+'/mystock',
      // data: '',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success: function (res) {
        // console.log(res.data.data);
        that.setData({
          mystocks: res.data.data,
          num: res.data.data.length
        })
      },

    })
  }
})