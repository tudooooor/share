// pages/businessInfo/businessInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flower:[1,2,3,4],
    tempFilePath:'/images/scan.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 上传收款码
  upload:function(){
    var that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        for (var index = 0; index < res.tempFiles.length; index++) {
          if (res.tempFiles[index].size >= 2000000) {
            wx.showToast({
              title: '上传图片不能大于2M!: 第' + (index + 1) + '张',  //标题
              icon: 'none',       //图标 none不使用图标，详情看官方文档
              duration: 3000,
            });
            return;
          }
        }
        var tempFilePaths = res.tempFilePaths
        that.setData({
          tempFilePath: tempFilePaths
        })
      }
    })
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