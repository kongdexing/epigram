//logs.js
//const util = require('../../utils/util.js')

//var order = ['red','yellow','blue','green','purple','red'];
Page({
  data: {
    order:[],
    toView: 'red',
    scrollTop:100,
    loadingHidden:true,
    scrollLog:'0',
    logevent:"world"
  },
  scrollV:function (event) {
    console.log("scrollV"+event.detail.scrollTop);
    // this.setData({
    //   loadingHidden:true,
    //   logevent:event.detail.scrollTop
    // })
  },
  refresh:function(e){
    this.setData({
      scrollTop:0
    })
  },
  onLoad: function () {

    var tempOrder = [];

    tempOrder.push("red");
    tempOrder.push("yellow");
    tempOrder.push("blue");
    tempOrder.push("purple");

    tempOrder.push("red");
    tempOrder.push("yellow");
    tempOrder.push("blue");
    tempOrder.push("purple");

    tempOrder.push("red");
    tempOrder.push("yellow");
    tempOrder.push("blue");
    tempOrder.push("purple");

    console.log("颜色个数："+tempOrder.length);
    this.setData({
      order:tempOrder
    })

    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })

  }
})
