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

    getAuthorize();

  },

  globalData: {
    userInfo: null,
    openId: ""
  }

})

function getAuthorize() {
  //获取用户授权
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userInfo']) {
        wx.authorize({
          scope: 'scope.userInfo',
          success() {
            console.log('scope userInfo success');
            //获取用户信息
            getUserWXInfo();
          },
          fail(res) {
            openWxSetting();
            // wx.showToast({
            //   title: "用户授权失败",
            //   image: '/pages/image/warning.png',
            //   duration: 1000
            // });
            console.log('scope userInfo fail ' + res);
          }
        })
      } else {
        getUserWXInfo();
      }
    }
  })
}

function openWxSetting() {
  wx.openSetting({
    success(settingdata) {
      if (!settingdata.authSetting['scope.userInfo']) {
        //未获得授权
        openWxSetting();
      } else {
        getUserWXInfo();
      }
      console.log('打开 setting ' + settingdata);
    }
  })
}

function getUserWXInfo() {
  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  wx.getUserInfo({
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      that.globalData.userInfo = res.userInfo

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (that.userInfoReadyCallback) {
        that.userInfoReadyCallback(res)
      }
    }
  })
}

function getUserOpenId() {
  // wx.showToast({
  //   title: "getUserOpenId",
  //   image: '../pages/image/success.png',
  //   duration: 1000
  // });

  console.log("App getUserOpenId");

  wx.login({
    success: function (res) {
      wx.request({
        url: 'http://school.xinpingtai.com/index.php/Api/WXopenId/getWXopenId',
        data: {
          js_code: res.code,
        },
        success: function (openIdResult) {
          let openid = openIdResult.data.data.openid;
          that.globalData.openId = openid;
          console.log('----app openId:' + that.globalData.openId);
        },
        fail: function (result) {
          wx.showToast({
            title: result,
            image: '../pages/image/warning.png',
            duration: 1000
          });
          console.log('get user openId fail ' + result);
        }
      })
    }
  });
};