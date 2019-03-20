// suggest/suggest.js
var date = new Date();
var timestamp = Date.parse(date);
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate();
//时
var h = date.getHours();
//分
var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
//秒
var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
var str = Y + "-" + M + "-" + D + "    " + h + ":" + m + ":" + s;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showmore1:true,
    time:str,
    buttontext1:"更多",
    showmore2:true,
    buttontext2:"更多"
  },

  jumpToStock: function (e) {
    var id = e.detail.value;
    // console.log('../singleStock/singlestock?id='+id);
    wx.navigateTo({
      url: '../singleStock/singlestock?id=' + id,
    })
  },

  addStock:function(e){
    var id=e.currentTarget.id;

    wx:wx.request({
      url: getApp().globalData.ip+'/addstock',
      data: {
        "stockcode":id,
        "date":"2018-07-30"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      
      success: function(res) {
        var state=res.data.state;
        if (state=="success"){
          wx.showToast({
            title: '添加成功',
            icon:"none"
          })
        }
        else{
          wx.showToast({
            title: '已添加',
            icon:"none"
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  jumpByTap:function(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '../singleStock/singlestock?id=' + id,
    });
    console.log(id);
  },

  

  jumpToMore1:function(){
    function changetext(text) {
      if (text == "更多") {
        return "收起";
      }
      return "更多";
    };
    this.setData({
      showmore1:!this.data.showmore1,
      buttontext1:changetext(this.data.buttontext1)
    })
  },

  jumpToMore2: function () {
    function changetext(text) {
      if (text == "更多") {
        return "收起";
      }
      return "更多";
    };
    this.setData({
      showmore2: !this.data.showmore2,
      buttontext2: changetext(this.data.buttontext2)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(that.data.showmore);
    wx.request({
      url: getApp().globalData.ip +'/firstpage/2018-07-30',
      // url: 'http://10.214.155.245:10011/search', //仅为示例，并非真实的接口地址
      method: 'GET',
      // data: {
      //   "stockcode": options.id,
      //   "date": "2018-07-30",
      // },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        that.setData({
          downdata:res.data.downdata,
          updata:res.data.updata
        });
        // console.log(that.data.downdata);
      }
    });

    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth,
    });

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