//logs.js
//const util = require('../../utils/util.js')
var Bmob = require('../../utils/bmob.js');
var that;

Page({
  data: {
    epigramList:[],
    toView: 'red',
    scrollTop:100,
    loadingHidden:true,
    scrollLog:'0',
    limit: 10,
    logevent:"world"
  },

  //下拉刷新
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh");
    getList();
  },
  onReachBottom: function () {
    this.setData({
      loadingHidden:false
    })

    var limit = that.data.limit + 10
    this.setData({
      limit: limit
    })
    this.onShow();

    console.log("-----scroll to load ");
  },
  pullUpLoad:function () {
    
  },
  onLoad: function () {
    that = this;
    wx.startPullDownRefresh();
    getList();
  },
  onShow: function () {
    getList();
  },

})

function getList() {
  var Epigram = Bmob.Object.extend("epigram");
  var query = new Bmob.Query(Epigram);
  // 查询所有数据
  query.limit(that.data.limit);
  query.descending("createdAt");
  query.find({
    success: function (results) {
      wx.stopPullDownRefresh();
      // 循环处理查询到的数据
      console.log(results);
      that.setData({
        loadingHidden: true,
        epigramList: results
      })
    },
    error: function (error) {
      wx.stopPullDownRefresh();
      that.setData({
        loadingHidden: true
      })
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
