// firstPage/firstPage.js
var date=new Date();
var timestamp=Date.parse(date);
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate();
//时
var h = date.getHours();
//分
var m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
//秒
var s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
var str=Y + "-"+M +"-"+ D + "    "+h + ":" + m + ":" + s;
var order=['1','2','3'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:str,
    array: ['SZ000001 平安银行'],
    index: 0
  },

  // bindPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },
  // tap: function (e) {
  //   for (var i = 0; i < order.length; ++i) {
  //     if (order[i] === this.data.toView) {
  //       this.setData({
  //         toView: order[i + 1],
  //         scrollTop: (i + 1) * 200
  //       })
  //       break
  //     }
  //   }
  // },
  // tapMove: function (e) {
  //   this.setData({
  //     scrollTop: this.data.scrollTop + 10
  //   })
  // },
  jumpByTap1:function(){
    wx.navigateTo({
      url: '../singleStock/singlestock?id=SZ000001',
    })
  },
  jumpByTap2: function () {
    wx.navigateTo({
      url: '../singleStock/singlestock?id=SH600000',
    })
  },
  jumpToStock:function(e){
    var id=e.detail.value;
    // console.log('../singleStock/singlestock?id='+id);
    wx.navigateTo({
      url: '../singleStock/singlestock?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})