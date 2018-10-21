var util = require('../../utils/util.js');

// pages/homePage/homePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: [],
    isInstruction: 'false',
    instruction:[],
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
        var instruction = [];
        if (data[0]['needInstruction'] == 1)
        {
          var temp = {};
          temp['nickName'] = data[0]['ownerNickname'];
          temp['shopImg'] = data[0]['ownerHeadimgurl'];
          temp['shopName'] = '店铺创建说明';
          temp['isInstruction'] = 'true';
          temp['goods'] = [{image_url: data[0]['ownerHeadimgurl']}];
          instruction.push(temp);
        }
        that.setData({
          "shopData": data,
          isInstruction: that.data.isInstruction,
          "instruction": instruction
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