var util = require('../utils/util.js')
var app = getApp();
var tempFilePaths = new Array(1)
tempFilePaths[0] = '../../images/incoming_code.jpg';

Page({
  data: {
    imageUrl: '',
    good_id:'',
  },

  chooseImg: function () {//调用  
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res)
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
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        tempFilePaths = res.tempFilePaths
        _this.setData({
          imageUrl: res.tempFilePaths
        })
      }
    })
  },

  preview_img: function () {//预览tupia  
  var image_arr = [];
  image_arr[0] = this.data.imageUrl;
    wx.previewImage({
      current: image_arr, // 当前显示图片的http链接  
      urls: image_arr // 需要预览的图片http链接列表  
    })
  },
  getQCode:function()
  {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getQCode&good_id=" + this.data.good_id + "&token=" + this.token;
    util.ajax({
      "url": url,
      success: function (res) {
        console.log(res)
        if (res['result'] == 0) {
          that.setData({
            imageUrl: res.shop_qcode
          });
        }
      },
      fail: function (res) {
        console.log(res)
      },
      error: function (res) {
      }

    });
  },
  onLoad:function (options){
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl'); 
    this.setData({good_id: options.good_id});
    this.getQCode();
  }
})  
