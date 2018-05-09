//logs.js
//const util = require('../../utils/util.js')
var Bmob = require('../../utils/bmob.js');
var app = getApp();
const util = app.util;
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
    hasUserInfo: false,
    touch_start: 0,
    touch_end: 0,
    reloadData: false
  },

  //下拉刷新
  onPullDownRefresh: function () {
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
  },
  refresh: function () {

  },
  pullUpLoad: function () {

  },
  scrollV: function () { },

  onLoad: function () {
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
    // getList();
    if (this.data.reloadData) {
      getList();
      this.setData({
        reloadData: false
      });
    }
  },
  onHide: function () {
    this.setData({
      reloadData: true
    });
  },
  onShareAppMessage: function () {
    return {
      // title: '悄悄说心事',
      // desc: '来自悄悄说的经典语句',
      path: '/pages/heart/heartlist'
    }
  },
  clickGood: function (e) {
    let good = e.currentTarget.dataset.good;  //点赞次数
    var id = e.currentTarget.dataset.id;

    let epigrams = that.data.epigramList;

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
  },

  mytouchstart: function (e) {
    that.setData({
      touch_start: e.timeStamp
    })
  },
  mytouchend: function (e) {
    that.setData({
      touch_end: e.timeStamp
    })
  },
  toDetail: function (e) {
    var touchTime = that.data.touch_end - that.data.touch_start;
    if (touchTime < 350) {
      var objectId = e.target.id ? e.target.id : e.currentTarget.id;
      console.log('click tap ');
      wx.navigateTo({
        url: '../detail/detail?id=' + objectId,
      })
    }
  },
  longTap: function (e) {
    var objectId = e.target.id ? e.target.id : e.currentTarget.id;
    var say = e.currentTarget.dataset.say;

    var popItem = ['复制', '收藏'];

    //判断是否收藏
    var Collect = Bmob.Object.extend("collect");
    var query = new Bmob.Query(Collect);
    query.equalTo("openId", app.globalData.openId);
    query.equalTo("epigramId", objectId);
    query.find({
      success: function (results) {
        console.log('query collect result ' + results.length);
        var collectId = '';
        if (results.length > 0) {
          popItem = ['复制', '取消收藏'];
          collectId = results[0].id;
          showPopList(popItem, say, objectId, false, collectId);
        } else {
          showPopList(popItem, say, objectId, true, collectId);
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        showPopList(popItem, say, objectId, true, "");
      }
    });
  },

})

function showPopList(popItem, content, objectId, isCollect, collectId) {
  wx.showActionSheet({
    itemList: popItem,

    success: function (res) {
      if (res.tapIndex == 0) {
        util.setClip(content + "----来自微信小程序【悄悄说心事】");
      } else if (res.tapIndex == 1) {
        //收藏|取消收藏
        if (isCollect) {
          collectEpig(objectId);
        } else {
          unCollectEpig(collectId);
        }
      } else if (res.tapIndex == 2) {
        //点赞

      }
    },
    fail: function (res) { }
  });
}

function collectEpig(objectId) {
  var Collect = Bmob.Object.extend("collect");
  var collect = new Collect();
  collect.set("openId", app.globalData.openId);
  collect.set("epigramId", objectId);
  //添加数据，第一个入口参数是null
  collect.save(null, {
    success: function (result) {
      wx.showToast({
        title: '收藏成功！',
        image: '../image/success.png',
        duration: 1000
      });
    },
    error: function (result, error) {
      // 添加失败
      wx.showToast({
        title: '收藏失败！',
        image: '../image/warning.png',
        duration: 1000
      });
      console.log('创建日记失败' + error);
    }
  });

}

function unCollectEpig(collectId) {
  var Collect = Bmob.Object.extend("collect");
  var query = new Bmob.Query(Collect);
  query.get(collectId, {
    success: function (object) {
      object.destroy({
        success: function (deleteObject) {
          wx.showToast({
            title: '取消收藏成功！',
            image: '../image/success.png',
            duration: 1000
          });
        },
        error: function (object, error) {
          console.log('delete error ' + object + ' ' + error);
        }
      });
    },
    error: function (object, error) {
      console.log("query object fail");
    }
  });
}

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
