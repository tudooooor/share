var util = require('../../utils/util.js');

// pages/homePage/homePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: [],

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.goodslists();
  },
  refresh: function () {
    this.goodslists();
  },
  onPullDownRefresh: function () {
    this.refresh();

  },
  goodslists: function () {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=shoplist&token=" + this.token;
    util.ajax({
      "url": url,
      "data": {
        "offset": 0,
        "size": 20
      },
      "success": function (data) {
        console.log('goodslists success', data);
        that.setData({
          "shopData": data,
        });
        wx.stopPullDownRefresh();
      }
    });
  },


  loaded: function () { this.setData({ page: { load: 1 } }); },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  error:function(res)
  {
    console.log("homePage error", res);
  }
})