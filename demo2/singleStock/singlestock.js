// firstPage/firstPage.js
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
var m = date.getMinutes();
//秒
var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
var str = "当前时间：" + Y + "-" + M + "-" + D + "  " + h + ":" + m + ":" + s;
var order = ['1', '2', '3'];

//引入外部js库
var wxCharts = require("../utils/wxcharts.js");
//定义记录初始屏幕宽度比例，便于初始化
var windowW = 0;

Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    time: str,
    
    index: 0,
  },

  addtomy:function(e){
    var id=e.currentTarget.id;
    wx: wx.request({
      url: getApp().globalData.ip + '/addstock',
      data: {
        "stockcode": id,
        "date": "2018-07-30"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',

      success: function (res) {
        var state = res.data.state;
        if (state == "success") {
          wx.showToast({
            title: '添加成功',
            icon: "none"
          })
        }
        else {
          wx.showToast({
            title: '已添加',
            icon: "none"
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  jumpToStock: function (e) {
    var id = e.detail.value;
    // console.log('../singleStock/singlestock?id='+id);
    wx.navigateTo({
      url: '../singleStock/singlestock?id=' + id,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    var that=this;
    // code=options.id;
    // console.log(typeof(options.id))
    that.setData({
      code:options.id
    })
    wx.request({
      url: getApp().globalData.ip +'/search',
      // url: 'http://10.214.155.245:10011/search', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        "stockcode": options.id,
        "date": "2018-07-30",
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        that.setData({
          name:res.data.Probdata[0][4],
          zhang:res.data.Probdata[0][3].toFixed(2),
          die:res.data.Probdata[0][2].toFixed(2),
          historydata: res.data.Hisdata.data,
          datacol:res.data.Hisdata.datacol
        });

        // console.log(res.data);



        var history=that.data.historydata;
        var dataname=that.data.datacol;
        var cate=new Array();
        var hisprice=new Array();
        var ep=new Array();
        var bp=new Array();
        var dp=new Array();
        var peg=new Array();
        var cfp=new Array();
        var ps=new Array();
        var cap=new Array();
        var circap=new Array();
        var arl=new Array();
        var roe=new Array();
        var roa=new Array();
        var mtm1=new Array();
        var mtm3=new Array();
        var mem6=new Array();
        var mem12=new Array();
        var sentiscore=new Array();
        for(var i=0;i<20;i++){
          cate.push(history[i][0])
        }

        for(var i=0;i<20;i++){
          ep.push(history[i][1]);
          bp.push(history[i][2]);
          dp.push(history[i][3]);
          peg.push(history[i][4]);
          cfp.push(history[i][5]);
          ps.push(history[i][6]);
          cap.push(history[i][7]);
          circap.push(history[i][8]);
          arl.push(history[i][9]);
          roe.push(history[i][10]);
          roa.push(history[i][11]);
          mtm1.push(history[i][12]);
          mtm3.push(history[i][13]);
          mem6.push(history[i][14]);
          mem12.push(history[i][15]);
          sentiscore.push(history[i][16]);
          hisprice.push(history[i][17])
        }
        // console.log(cate);

        new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: cate,
          // animation: true,
          background: '#f5f5f5',
          // dataPointShape:false,
          series: [{
            name: '历史股价',
            data: hisprice,
            format: function (val, name) {
              return val.toFixed(2);
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '历史股价 (元)',
            format: function (val) {
              return val.toFixed(2);
            },
            
          },
          width: (375 * windowW),
          height: (220 * windowW),
          dataLabel: false,
          dataPointShape: false,
          extra: {
            lineStyle: 'straight',
            // ringWidth:'1rpx'
          }
        });
        new wxCharts({
          canvasId: 'factorCanvas2',
          type: 'line',
          categories: cate,
          // animation: true,
          background: '#f5f5f5',
          // dataPointShape:false,
          series: [
          {
            name: 'PEG',
            data: peg,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
  
          {
            name: 'PS',
            data: ps,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'CAP',
            data: cap,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'CIR_CAP',
            data: circap,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            // title: '历史股价 (元)',
            format: function (val) {
              return val.toFixed(2);
            },

          },
          width: (375 * windowW + 5),
          height: (220 * windowW),
          dataLabel: false,
          dataPointShape: false,
          extra: {
            lineStyle: 'straight',
            // ringWidth:'1rpx'
          }
        });
        new wxCharts({
          canvasId: 'factorCanvas3',
          type: 'line',
          categories: cate,
          // animation: true,
          background: '#f5f5f5',
          // dataPointShape:false,
          series: [{
            name: 'EP',
            data: ep,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'BP',
            data: bp,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'DP',
            data: dp,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'CFP',
            data: cfp,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'ARL',
            data: arl,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'ROE',
            data: roe,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },
          {
            name: 'ROA',
            data: roa,
            format: function (val, name) {
              return val.toFixed(2);
            }
          },],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            // title: '历史股价 (元)',
            format: function (val) {
              return val.toFixed(2);
            },

          },
          width: (375 * windowW + 5),
          height: (220 * windowW),
          dataLabel: false,
          dataPointShape: false,
          extra: {
            lineStyle: 'straight',
            // ringWidth:'1rpx'
          }
        });
        new wxCharts({
          canvasId: 'factorCanvas',
          type: 'line',
          categories: cate,
          // animation: true,
          background: '#f5f5f5',
          // dataPointShape:false,
          series: [
            {
              name: 'MTM1',
              data: mtm1,
              format: function (val, name) {
                return val.toFixed(2);
              }
            },
            {
              name: 'MTM3',
              data: mtm3,
              format: function (val, name) {
                return val.toFixed(2);
              }
            ,
            },
            {
              name: 'MEM6',
              data: mem6,
              format: function (val, name) {
                return val.toFixed(2);
              }
            },
            {
              name: 'MEM12',
              data: mem12,
              format: function (val, name) {
                return val.toFixed(2);
              }
            },
            {
              name: 'sentiscore',
              data: sentiscore,
              format: function (val, name) {
                return val.toFixed(2);
              }
            }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            // title: '历史股价 (元)',
            format: function (val) {
              return val.toFixed(2);
            },

          },
          width: (375 * windowW + 5),
          height: (220 * windowW),
          dataLabel: false,
          dataPointShape: false,
          extra: {
            lineStyle: 'straight',
            // ringWidth:'1rpx'
          }
        });
      }
    });
    
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth,
    });
    // console.log(this.data.imageWidth);

    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    // console.log(windowW);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this.zhang);
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