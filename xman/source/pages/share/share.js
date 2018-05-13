// info.js
 const config = require('../../config.js');
 var util = require('../../utils/util.js');
Page({
  data: {
    send: false,
    image:'',
    goodId:'',
  },
  drawPic: function (QRcodeImagePath, image_url, goods_name, goods_desc)
  {
    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('myCanvas');
    var imgPath = image_url;
    var bgImgPath = '../../images/home.png';
    var basicprofile = '../../images/home.png';
    // var xcxcode = options.goods_imgs;
    var xcxcode = QRcodeImagePath;
    //填充背景
    ctx.setFillStyle('#cccccc');
    ctx.fillRect(0, 0, 340, 460);
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(1, 1, 238, 358);

    //绘制产品图
   //ctx.drawImage(imgPath, 2, 2, 236, 200);

    //绘制标题
    ctx.setFontSize(16);
    ctx.setFillStyle('#000000');
    ctx.fillText(goods_name, 10, 225);

    //绘制介绍产品
    ctx.setFontSize(12);
    ctx.setFillStyle('#6F6F6F');
    ctx.fillText(goods_desc, 10, 250);

    //绘制一条虚线

    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.setLineWidth(1);
    ctx.setLineDash([2, 4]);
    ctx.moveTo(10, 287);
    ctx.lineTo(230, 287);
    ctx.stroke();

    //绘制矿业人图标
    ctx.drawImage(basicprofile, 10, 310, 30, 30);

    //绘制介绍
    ctx.setFontSize(11);
    ctx.setFillStyle('#aaaaaa');
    ctx.fillText('长按扫码查看详情', 47, 318);
    ctx.fillText('分享商品', 47, 338);
    ctx.drawImage(xcxcode, 2, 2, 236, 236);

    ctx.draw();
  },

  getwxacode: function (goods_id, image_url, goods_name, goods_desc)
  {
    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getwxacode&good_id=" + goods_id + "&token=" + this.token;
    util.ajax({
      "url": url,
      "data": {
        "offset": 0,
        "size": 20
      },
      error: function (res) {
      },
      "success": function (res) {
        if (res['result'] == 0) {
          that.drawPic(res.filePath, image_url, goods_name, goods_desc);
        }
      }
    });
  },
  onLoad: function (options) {

    this.baseApiUrl = util.config('baseApiUrl');
    this.token = wx.getStorageSync('token');
    var that = this;
    //1. 请求后端API生成小程序码
    that.getwxacode(options.goods_id, options.image_url, options.goods_name, options.goods_desc);

  },
  savetup: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 240,
      height: 360,
      destWidth: 240,
      destHeight: 360,
      canvasId: 'myCanvas',
      success: function (res) {
        //调取小程序当中获取图片
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，去发圈噻~',
              showCancel: false,
              confirmText: '好哒',
              confirmColor: '#72B9C3',
              success: function (res) {
                if (res1.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })},
// 手机号部分
  
    
})
