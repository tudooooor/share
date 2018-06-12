var adds = { shopName: "", shopDesc: "", shopImg: "" };
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_arr: [],
    shopNameInput: '',
    shopName: "",
    shopImg: "",
    shopDesc: "",
    lastX: 0,
    lastY: 0,
  },
  deleteImage: function (e) {
    var tempImage = [];
    this.setData({
      img_arr: tempImage
    });

  },
  handletouchend: function (event) {
    console.log(event);
    var text;
    let currentX = event.changedTouches[0].pageX;
    let currentY = event.changedTouches[0].pageY;
    let tx = currentX - this.data.lastX;
    let ty = currentY - this.data.lastY;
    console.log(tx);
    console.log(ty);
    if (ty < -100 || ty > 100) {
      this.deleteImage(event);
    }
  },
  handletouchstart: function (event) {
    console.log(event);
    this.data.lastX = event.touches[0].pageX;
    this.data.lastY = event.touches[0].pageY;
  },
  getShopData: function () {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getShopData&token=" + this.token;

    util.ajax({
      "url": url,
      "success": function (data) {
        if (data['statusCode'] == 0) {
          that.setData({
            shopName: data.shopName,
            img_arr: data.shopImg,
            shopDesc: data.shopDesc
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.getShopData();
  },
  shopNameInput: function (e) {
    this.data.shopNameInput = e.detail
  },
  shopEditCompelete: function () {
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=shopEdit&token=" + this.token;
    util.ajax({
      "url": url,
      "data": adds,
      "success": function (data) {
        if (data['statusCode'] == 0) {
          wx.navigateBack();
        }
      }
    });
  },
  formSubmit: function (e) {
    var that = this;
    adds.shopName = e.detail.value.shopName;
    adds.shopDesc = e.detail.value.shopDesc;
    if (e.detail.value.shopName == "" || e.detail.value.shopDesc == "" || this.data.img_arr.length == 0) {
      wx.showToast({
        title: '请填写信息',
        duration: 3000
      });
      return;
    }

    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;

    if (this.data.img_arr[0].indexOf("Uploads") == -1) {
      wx.uploadFile({
        url: url,
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
          that.shopEditCompelete();
          console.log(res)
        },
        fail: function (res) {
          console.log(res);
        }

      });
    }
    else {
      this.shopEditCompelete();
    }

  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function (res) {
        that.setData({
          img_arr: res.tempFilePaths
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