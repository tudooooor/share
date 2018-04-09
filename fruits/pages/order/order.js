// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorSel: "#eeeceb",
    shopList: [1, 2, 3, 4, 5, 6],
    flower: [1, 2, 3, 4],
    discount: 7,
    ship:1  //是否发货的参数，默认1为已发货，并显示其样式，否则显示未发货
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  viewDetail:function(){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
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