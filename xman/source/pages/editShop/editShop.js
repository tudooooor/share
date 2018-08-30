var adds = { shopName: "", shopDesc: "", shopImg: "" , shopImg_QCode:""};
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_arr: [],
    img_arr_QCode:[],
    shopNameInput: '',
    shopName: "",
    shopImg: "",
    shopDesc: "",
    lastX: 0,
    lastY: 0,
    showTextare:'none',
    valueTextarea:'',
  },
  deleteImage: function (e) {
    // var tempImage = [];
    // this.setData({
    //   img_arr: tempImage
    // });

  },
  textareaConfirm:function(e)
  {
    var value = this.data.valueTextarea;
    if (this.data.valueTextarea == '')
    {
      value = this.data.shopDesc;
    }
    this.setData({
      shopDesc: value,
      showTextare:'none'
    });
  },
  textareaCancel: function (e) {
    this.setData({
      showTextare: 'none'
    });
  },
  textareaInput:function(e)
  { 
    this.data.valueTextarea = e.detail.value;
  },
  maskDisplay: function () {
    this.setData({
      showTextare: 'flex'
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
            shopDesc: data.shopDesc,
            img_arr_QCode: data.shopQCode,
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
  uploadImgOne: function (url) {
    var img;
    if (this.data.img_arr.indexOf("Uploads") == -1)
    {
      img = this.data.img_arr[0];
      adds.shopImg_QCode = this.data.img_arr_QCode;
    }
    else
    {
      img = this.data.img_arr_QCode[0];
      adds.shopImg = this.data.img_arr;
    }
    var that = this;
    wx.uploadFile({
      url: url,
      filePath: img,//that.data.img_arr[0],
      name: 'file',
      header: { "Content-Type": "application/json" },
      // formData: adds,
      success: function (res) {
        var data = JSON.parse(res.data);

        if (that.data.img_arr.indexOf("Uploads") == -1) {
          adds.shopImg = data["url"];
        }
        else {
          adds.shopImg_QCode = data["url"];
        }

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
  },
  uploadImg: function (url, img, counter)
  {
    var that = this;
    wx.uploadFile({
      url: url,
      filePath: img,//that.data.img_arr[0],
      name: 'file',
      header: { "Content-Type": "application/json" },
      // formData: adds,
      success: function (res) {
        counter++;
        var data = JSON.parse(res.data);
        if (counter == 1)
        {
          adds.shopImg = data["url"];
          that.uploadImg(url, that.data.img_arr_QCode[0], counter);
        }
        else
        {
          adds.shopImg_QCode = data["url"];
        }

        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        if (counter == 2)
        {
          that.shopEditCompelete();
        }
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      }

    });
  },
  formSubmit: function (e) {
    var that = this;
    adds.shopName = e.detail.value.shopName;
    adds.shopDesc = this.data.shopDesc;
    if (e.detail.value.shopName == "" || this.data.shopDesc == "" || this.data.img_arr.length == 0 || this.data.img_arr_QCode.length == 0) {
      wx.showToast({
        title: '请填写信息',
        duration: 3000
      });
      return;
    }

    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;
    var ttt = (this.data.img_arr.indexOf("Uploads") == -1);
    if (this.data.img_arr.indexOf("Uploads") == -1 && this.data.img_arr_QCode.indexOf("Uploads") == -1) {
      var counter = 0;
      that.uploadImg(url, this.data.img_arr[0], counter);
    }
    else if (this.data.img_arr.indexOf("Uploads") == -1 || this.data.img_arr_QCode.indexOf("Uploads") == -1)
    {
      that.uploadImgOne(url)
    }
    else {
      adds.shopImg = this.data.img_arr;
      adds.shopImg_QCode = this.data.img_arr_QCode;
      this.shopEditCompelete();
    }

  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      success: function (res) {
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
        that.setData({
          img_arr: res.tempFilePaths
        })
      }
    });
  },
  upimg_QCode: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      success: function (res) {
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
        that.setData({
          img_arr_QCode: res.tempFilePaths
        })
      }
    });
  },
  bindGoodsDesc: function () {

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
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      shopName: this.data.shopName,
      shopLogo: this.data.img_arr,
    });

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