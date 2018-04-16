var that;

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
          //循环
          res.data.forEach((item) => {
            if (item.objectId == that.data.objectId) {
              that.setData({
                epigram: item
              });
              console.log("item object id " + item.objectId + "  " + item.say);
              return;
            }
          })
        } else {
          //网络获取数据
          getEpigram();
        }
      },
    })

  },

})

function getEpigram() {


}