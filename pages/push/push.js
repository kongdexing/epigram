var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    epigramVal:"",
    btnVal: "1",
    broadColor:"#6e7d8f",
    broadCols: ["#3c3d3c", "#f5d575", "#f69595", "#c5a6c1", "#71aaa9", "#90cbe3", 
    "#6e7d8f", "#62ad98", "#d3cc72", "#e9d4a9", "#dba6a1"]
  },

  changeTextColor:function(event){
    var col = event.currentTarget.dataset.broadcolor;
    this.setData({
      broadColor:col
    })

  },

  contentInput:function(e){
    this.setData({
      epigramVal: e.detail.value
    })
  },

  formSubmit:function(e){
    var Epigram = Bmob.Object.extend("epigram");
    var epigram = new Epigram();
    epigram.set("say", this.data.epigramVal);
    epigram.set("color", this.data.broadColor);
    //添加数据，第一个入口参数是null
    epigram.save(null, {
      success: function (result) {
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 1000
        });
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("日记创建成功, objectId:" + result.id);
      },
      error: function (result, error) {
        // 添加失败
        wx.showToast({
          title: '发布失败！',
          icon: 'success',
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
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})