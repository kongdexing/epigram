var Bmob = require('../../utils/bmob.js');
const app = getApp();
const appParam = app.appParam;
var that;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    epigramVal: "",
    btnVal: "1",
    userInfo: {},
    broadColor: "#6e7d8f",
    broadCols: ["#3c3d3c", "#f5d575", "#f69595", "#c5a6c1", "#71aaa9", "#90cbe3",
      "#6e7d8f", "#62ad98", "#d3cc72", "#e9d4a9", "#dba6a1"]
  },

  changeTextColor: function (event) {
    var col = event.currentTarget.dataset.broadcolor;
    this.setData({
      broadColor: col
    })

  },

  contentInput: function (e) {
    console.log("32424：" + e);

    this.setData({
      epigramVal: e.detail.value
    })
  },

  formSubmit: function (e) {

    var val = this.data.epigramVal;
    if (val == "") {
      wx.showToast({
        title: '请输入想说的话！',
        image: '../image/warning.png',
        duration: 1000
      });
      console.log('val is empty');
      return;
    }
    var Epigram = Bmob.Object.extend("epigram");
    var epigram = new Epigram();
    epigram.set("userId", app.globalData.openId);
    epigram.set("say", val);
    epigram.set("nickName", this.data.userInfo.nickName);
    epigram.set("avatarUrl", this.data.userInfo.avatarUrl);
    epigram.set("color", this.data.broadColor);
    //添加数据，第一个入口参数是null
    epigram.save(null, {
      success: function (result) {
        wx.showToast({
          title: '发布成功！',
          image: '../image/success.png',
          duration: 1000
        });
        //返回上一级
        wx.navigateBack({
          delta: 1
        })
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("日记创建成功, objectId:" + result.id);
      },
      error: function (result, error) {
        // 添加失败
        wx.showToast({
          title: '发布失败！',
          image: '../image/warning.png',
          duration: 1000
        });
        console.log('创建日记失败' + error);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    console.log('获取 openId ' + app.globalData.openId);

    // wx.showToast({
    //   title: app.globalData.openId,
    //   image: '../image/warning.png',
    //   duration: 3000
    // });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})
