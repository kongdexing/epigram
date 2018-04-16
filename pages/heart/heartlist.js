//logs.js
//const util = require('../../utils/util.js')
var Bmob = require('../../utils/bmob.js');
var app = getApp();
const appParam = app.appParam;
var that;

Page({
  data: {
    epigramList: [],
    toView: 'red',
    scrollTop: 100,
    loadingHidden: true,
    scrollLog: '0',
    limit: 10,
    logevent: "world",
    userInfo: {},
    hasUserInfo: false
  },

  //下拉刷新
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    getList();
  },
  onReachBottom: function () {
    this.setData({
      loadingHidden: false
    })

    var limit = that.data.limit + 10
    this.setData({
      limit: limit
    })
    getList();

    console.log("-----scroll to load ");
  },
  refresh: function () {

  },
  pullUpLoad: function () {

  },
  scrollV: function () { },

  onLoad: function () {
    console.log('heartlist onLoad');
    that = this;
    //先获取本地缓存,若有数据则加载本地数据，无数据时网络获取
    wx.getStorage({
      key: 'heartlist',
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({
            epigramList: res.data
          });
        } else {
          //网络获取数据
          getList();
        }
        // console.log('onLoad getStorageInfo success  ' + res.data.length);
      },
      fail: function (res) {
        // console.log('onLoad getStorageInfo fail');
        //网络获取数据
        getList();
      },
      complete: function (res) {
        // console.log('onLoad getStorageInfo complete');
      }
    })
  },

  onShow: function () {
    console.log('heartlist onShow');
    // getList();
  },

  clickGood: function (e) {
    let good = e.currentTarget.dataset.good;  //点赞次数
    var id = e.currentTarget.dataset.id;

    let epigrams = that.data.epigramList;
    console.log("epigrams size is " + epigrams.length);

    // epigrams.forEach(function (item, index) {
    //   if (item.objectId == id) {
    //     console.log("foreach id = " + id);
    //     item.hgood = !item.hgood;
    //   }
    // });

    epigrams.forEach((item) => {
      if (item.id == id) {
        console.log("item object id " + item.id + "  " + item.attributes.say);
        item.hgood = !item.hgood || false;
      }
    })

    that.setData({
      epigramList: that.data.epigramList
    });

    let currentIndex = that.data.epigramList.findIndex(e => e.id === id);
    // console.log("click good id is " + id + " index:" + currentIndex);

    var epi = that.data.epigramList[currentIndex];

    // console.log("click good status " + that.data.epigramList.find((e) => e.objectId === id).say);

    // that.setData({
    //   [that.data.epigramList[currentIndex].hgood]: true
    // })

    //arr-对象|index-索引
    let tmp = that.data.epigramList.map(function (arr, index) {
      if (arr.objectId == id) {
        console.log("遇到对的人：" + id);
      }
      return arr;
    });

    if (good == undefined) {
      good = 1;
    } else {
      good += 1;
    }

    var Epigram = Bmob.Object.extend("epigram");
    var epigram = new Epigram();
    //这个 id 是要修改条目的 objectId，你在
    //这个存储并成功时可以获取到，请看前面的文档
    epigram.get(id, {
      success: function (result) {
        console.log("get success");
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('good', good);
        result.save();

        // The object was retrieved successfully.
      },
      error: function (object, error) {
        console.log('save error ' + error);
      }
    });

  },

  clickHug: function (e) {
    console.log("clickHug----<><>" + e.currentTarget.dataset.hug);
  },
  createBtnClick: function (e) {
    console.log("createBtnClick");
    wx.navigateTo({
      url: '../push/push',
      success: function () {
        console.log("success");
      },
      fail: function (result) {
        console.log("fail" + result);
      },
      complete: function () {
        console.log("complete");
      }
    })
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
      that.setData({
        loadingHidden: true,
        epigramList: results
      })

      wx.setStorage({
        key: 'heartlist',
        data: results
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
