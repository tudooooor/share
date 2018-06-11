var adds = { shopName: "", shopDesc: "", shopImg:""};
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_arr: [],
    shopNameInput: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
  },
  shopNameInput: function (e) {
    this.data.shopNameInput = e.detail
  },
  formSubmit: function (e) {
    var that = this;
    adds.shopName = e.detail.value.shopName;
    adds.shopDesc = e.detail.value.shopDesc;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;
    // url = this.baseApiUrl + "?g=Api&m=Weuser&a=shopEdit&token=" + this.token;
    wx.uploadFile({
      url: url,//'http://127.0.0.1/weipin-admin/',
      filePath: that.data.img_arr[0],
      name: 'file',
      header: { "Content-Type": "application/json" },
      // formData: adds,
      success: function (res) {
        var data = JSON.parse(res.data);

        adds.shopImg = data["url"];
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        var url = that.baseApiUrl + "?g=Api&m=Weuser&a=shopEdit&token=" + that.token;

        util.ajax({
          "url": url,
          "data": adds,
          "success": function (data) {
            if (data['result'] == "ok") {
              wx.navigateBack();
            }
          }
        });

      
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      }

    });

  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function (res) {
        that.setData({
          img_arr: that.data.img_arr.concat(res.tempFilePaths)
        })
      }
    });
  },
  bindGoodsDesc: function () {
    var xxx;
    xxx++;
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