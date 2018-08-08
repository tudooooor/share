var util = require('../utils/util.js')
Page({
  data: {
    "goods_list": [],
    title: "",
    hidden: true,
    loaded: false,
    shopLogo:'',
    shopName:'',
    QCodeDisplay:'none'
  },
  bindDeleteGood: function (event) {
    var that = this;
    console.log(event);
    if (event.currentTarget.dataset.goods_id == "") {
      return;
    }
    var url = this.baseApiUrl + "?g=Api&m=Goods&a=del&id=" + event.currentTarget.dataset.goods_id;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          util.ajax({
            url: url,
            method: "GET",
            success: function (data) {
              that.refresh();
            }
          });
        }
      }
    })
  },
  onLoad: function (options) {
    this.goods_id = options.goods_id;

    this.address_id = options.address_id;
    var data = {};
    if (this.sell_type && this.sell_type != undefined) {
      data.sell_type = this.sell_type;
    }

    if (this.goods_id && this.goods_id != undefined) {
      data.goods_id = this.goods_id;
    }

    if (this.address_id && this.address_id != undefined) {
      data.address_id = this.address_id;
    }

    this.setData(data);
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.goodsList();
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    wx.hideNavigationBarLoading();
    // 页面渲染完成
  },
  onShow: function () {
    if (!this.is_onload) {
      this.refresh();
    } else {
      this.is_onload = 0;
    }
    // 页面显示
  },
  refresh: function () {
    util.loadding(this, 1);
    this.goodsList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //监听用户下拉动作
  onPullDownRefresh: function () {
    this.refresh();
    wx.stopPullDownRefresh();
  },
  loadding: function () {
    util.loadding(this);
  },
  loaded: function () {
    util.loaded(this);
  },
  shareDisplay: function () {
    this.setData({
      QCodeDisplay: 'flex'
    });
  },
  shareHide: function () {
    this.setData({
      QCodeDisplay: 'none'
    });
  },
  shareQCode: function () {
    this.getwxacode(this.data.shopLogo, this.data.shopName);
  },
  goodsList: function () {
  {
      var that = this;
      var url = this.baseApiUrl + "?g=Api&m=Weuser&a=lists&token=" + this.token;
      util.ajax({
        "url": url,
        "data": {
          "offset": 0,
          "size": 20
        },
        "success": function (data) {
          console.log('goodsList success', data);
          if (data['result'] == "ok") {
            that.setData({
              "goods_list": data.goods,
              shopLogo: data.shopImg,
            });
            wx.setNavigationBarTitle({
              title: data.shopName//页面标题为路由参数
            });
            util.loaded(that);
          }
        }
      });
    }
  },

  drawPic: function (QRcodeImagePath, shopName, shopLogo) {
    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('myCanvas');

    ctx.setFillStyle('#ffffff');
    ctx.fillRect(1, 1, 650, 500);

    ctx.setFontSize(16);
    ctx.setFillStyle('#000000');
    ctx.fillText(shopName, 130, 30);
    //绘制产品图

    // ctx.setFontSize(16);
    // ctx.setFillStyle('#000000');
    // ctx.fillText(goods_name, 20, 270);


    //绘制一条虚线

    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.setLineWidth(1);
    ctx.setLineDash([2, 4]);
    ctx.moveTo(10, 290);
    ctx.lineTo(320, 290);
    ctx.stroke();


    //绘制介绍
    ctx.setFontSize(11);
    ctx.setFillStyle('#aaaaaa');
    ctx.fillText('长按识别小程序二维码查看详情', 130, 350);

    var that = this;
    wx.downloadFile({
      url: QRcodeImagePath, //仅为示例，并非真实的资源
      success: function (res) {
        var that1 = that;
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          var QRcodeFilePath = res.tempFilePath;
          wx.downloadFile({
            url: shopLogo, //仅为示例，并非真实的资源
            success: function (res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                // that1.setData({
                //   downloadFristPic: res.tempFilePath
                // });
                ctx.drawImage(res.tempFilePath, 70, 50, 180, 190);
                // ctx.drawImage(res.tempFilePath, 50, 50, 200, 200);
                ctx.drawImage(QRcodeFilePath, 10, 300, 100, 100);
                ctx.draw();
                that1.setData({
                  QCodeDisplay: "flex"
                });
              }
            }
          });
        } else {
          that.error(data);
        }


      }
    });

  },
  QCodeHide: function () {
    this.setData({
      QCodeDisplay: "none"
    });
  },
  getwxacode: function (shopLogo='', shopName='') {
    var that = this;
    var url;

    url = this.baseApiUrl + "?g=Api&m=Weuser&a=getwxacode&token=" + this.token;

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
          that.drawPic(res.filePath, shopName, shopLogo);
        }
      }
    });


  },
  // onLoad: function (options) {
  //   var that = this;
  //   //1. 请求后端API生成小程序码
  //   if (options.goods_id != undefined) {
  //     that.getwxacode(options.goods_id, options.image_url, options.goods_name, options.goods_desc);
  //   }
  //   else {
  //     that.getwxacode();
  //   }
  // },
  savetup: function () {
    var that = this;
    wx.canvasToTempFilePath({
      // x: 0,
      // y: 0,
      // width: 240,
      // height: 360,
      // destWidth: 240,
      // destHeight: 360,
      canvasId: 'myCanvas',
      success: function (res) {
        //调取小程序当中获取图片
        console.log(res.tempFilePath);
        var img = res.tempFilePath;
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
                if (res.confirm) {
                  console.log('用户点击确定', res);
                }

                wx.previewImage({
                  current: '', // 当前显示图片的http链接
                  urls: [img] // 需要预览的图片http链接列表
                });
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })

    this.QCodeHide();
  },
})