var that;
var Bmob = require('../../utils/bmob.js');
var app = getApp();
const util = app.util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectId: '',
    epigram: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    this.setData({
      objectId: options.id
    });

    console.log("onLoad detail id is " + this.data.objectId);

    //从缓存中根据 id 取出对象
    wx.getStorage({
      key: 'heartlist',
      success: function (res) {
        console.log('the result length is ' + res.data.length);

        if (res.data.length > 0) {
          var exist = false;
          //循环
          res.data.forEach((item) => {
            if (item.objectId == that.data.objectId) {
              that.setData({
                epigram: item
              });
              exist = true;
              console.log("item object id " + item.objectId + "  " + item.say);
              return;
            }
          });

          if (!exist) {
            getEpigram();
          }
        } else {
          //网络获取数据
          getEpigram();
        }
      },
      fail: function (er) {
        getEpigram();
      }
    })

  },

  onGoodClick: function (e) {
    console.log('onGoodClick');
    //点赞
    var Epigram = Bmob.Object.extend("epigram");
    var queryE = new Bmob.Query(Epigram);
    queryE.get(this.data.objectId, {
      success: function (result) {
        var good = result.attributes.good;

        if (good == undefined) {
          good = 1;
        } else {
          good += 1;
        }

        result.set('good', good);
        result.save();

        var _epigram = that.data.epigram;
        _epigram.good = good;
        that.setData({
          epigram: _epigram
        })

      }
    });

  },

  onShareAppMessage: function () {
    return {
      // title: '悄悄说心事',
      // desc: '来自悄悄说的经典语句',
      path: '/pages/detail/detail?id=' + this.data.epigram.objectId
    }
  },

  onShareClick: function (e) {
    console.log('onShareClick');
    //复制
    util.setClip(this.data.epigram.say + "----来自微信小程序【悄悄说心事】");

  },

})

function getEpigram() {
  var Epigram = Bmob.Object.extend("epigram");
  var queryE = new Bmob.Query(Epigram);
  queryE.equalTo("objectId", that.data.objectId);
  queryE.find({
    success: function (results) {
      that.setData({
        epigram: results[0]
      })
    }
  });

}