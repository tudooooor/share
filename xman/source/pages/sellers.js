var util = require('../utils/util.js')
var app = getApp();
var tempFilePaths = new Array(1)
tempFilePaths[0] = '../../images/incoming_code.jpg';

Page({
  data: {
    imageUrl: ''
  },

  chooseImg: function () {//调用  
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        tempFilePaths = res.tempFilePaths
        _this.setData({
          imageUrl: res.tempFilePaths
        })
      }
    })
  },

  preview_img: function () {//预览tupia  
    wx.previewImage({
      current: this.data.imageUrl, // 当前显示图片的http链接  
      urls: this.data.imageUrl // 需要预览的图片http链接列表  
    })
  },

  onLoad:function (options){

    var _this = this;
    _this.setData({
      imageUrl: tempFilePaths
    })
  }
})  
