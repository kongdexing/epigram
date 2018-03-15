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
  refresh:function(){

  },
  pullUpLoad:function () {
    
  },
  scrollV:function(){},

  onLoad: function () {
    that = this;
    wx.startPullDownRefresh();
    getList();
  },
  onShow: function () {
    getList();
  },

  clickGood:function(e){
    var good = e.currentTarget.dataset.good;
    var id = e.currentTarget.dataset.id;
    if(good==undefined){
      good = 1;
    }else{
      good+=1;
    }

    var Epigram = Bmob.Object.extend("epigram");
    var epigram = new Epigram();
    // 这个 id 是要修改条目的 objectId，你在
    //这个存储并成功时可以获取到，请看前面的文档
    epigram.get(id, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('good', good);
        result.save();
        // The object was retrieved successfully.
      },
      error: function (object, error) {
        console.log('save error '+error);
      }
    });

    console.log("clickGood--" + id+" good:"+good);
  },
  clickHug:function(e){
    console.log("clickHug----<><>" + e.currentTarget.dataset.hug);
  }

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
