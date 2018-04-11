//app.js
var that;

App({
  onLaunch: function () {

    that = this;

    const Bmob = require('utils/bmob.js');
    Bmob.initialize("dce0be3d571021a9eac5f0a321a79881", "62a2cb5b8baf5b9bc43d8c43bd9a803c");

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('app wx login success');
        getUserOpenId();
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    openId:""
  }

})

function getUserOpenId() {
  console.log("App getUserOpenId");
  wx.login({
    success: function (code) {
      wx.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        data: {
          appid: 'wxb4ddb059c36f48c3',
          secret: 'cf6d03f9d3e77b43ec9d5f2c34e090ed',
          js_code: code.code,
          grant_type: 'authorization_code'
        },
        success: function (openIdResult) {
          let openid = openIdResult.data.openid;
          that.globalData.openId = openid;
          console.log('app openId:' + openid);
        }
      })
    }
  });
};