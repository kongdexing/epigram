//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
const app = getApp()
var that;

Page({
  data: {
    tabs: ['我发布的', '我收藏的'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    userInfo: {},
    epigramList: [],
    hasUserInfo: false,
    loadingHidden: true,
    scrollLog: '0',
    limit: 10,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    this.onShow();

    console.log("-----scroll to load ");
  },
  refresh: function () {

  },
  pullUpLoad: function () {

  },
  scrollV: function () { },

  onShow: function () {
    getList();
  },

  onLoad: function () {
    wx.showToast({
      title: app.globalData.openId,
      image: '../image/warning.png',
      duration: 3000
    });

    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        // hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          // hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            // hasUserInfo: true
          })
        }
      })
    }

    that = this;
    wx.startPullDownRefresh();
    getList();

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: this.data.stv })
  },
  _updateSelectedPage(page) {
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  }
})

function getList() {
  var wxId = app.globalData.openId;
  console.log('11 wxId:' + wxId);
  if(wxId==""){
    wx.showToast({
      title: "未获取用户ID",
      image: '../image/warning.png',
      duration: 1000
    });
    return;
  }

  var Epigram = Bmob.Object.extend("epigram");
  var query = new Bmob.Query(Epigram);
  // 查询个人发布数据
  query.limit(that.data.limit);
  query.equalTo("userId", wxId);
  query.descending("createdAt");
  query.find({
    success: function (results) {
      wx.stopPullDownRefresh();
      // 循环处理查询到的数据
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
