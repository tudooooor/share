var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskShow:'none',
    showPhoneNumber:'none',
    showShare:'none',
    numberGoods:10,
    goods:[],
    goodCategorys:[],
    galleryPreImage:[],
    gallery:[],
    count:[0, 0, 0, 0, 0, 0, 0 , 0, 0, 0],
    swiperCurrent: 1,
    minPrice: 0,
    maxPrice: 0,
    goods_name: '',
    totalPrice:0,
    goodSpecifications:'',
    good_id:'',
    goods_desc:'',
    garreryDetail:[],
    garreryDetailPreImage: [],
    address:'',
    address_id:'',
    failInfo:'',
    phoneNumber:'',
    QCodeDisplay:'none',
    strPrice:'',
    downloadFristPic:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  previewImage:function(e)
  {
    wx.previewImage({
      current: this.data.galleryPreImage[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.galleryPreImage // 需要预览的图片http链接列表
    })
  },
  previewImageDetail: function (e) {
    wx.previewImage({
      current: this.data.garreryDetailPreImage[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.garreryDetailPreImage // 需要预览的图片http链接列表
    })
  },
  bindchange:function (e)
  {
    console.log(e);
    this.setData({
      swiperCurrent: ++e.detail.current
    });
  },
  buyNowCheck:function ()
  {
    // if (this.data.address_id == '') {
    //   this.data.failInfo = '请填写地址';
    // }
    if (this.data.goodSpecifications == '')
    {
      this.data.failInfo = '请填写商品类型';
    }

    if (this.data.failInfo != '')
    {
      wx.showToast({
        title: this.data.failInfo,
        duration: 2000,
        icon:'none',
      });
      this.data.failInfo = '';
      return false;
    }

    return true;
  },
  buyNowConfirm:function()
  {
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=orders&token=" + this.token;
    //默认是单独购买
    var data = {
      "goods_id": this.data.good_id,
      "address_id": this.data.address_id,
      "groupbuy": this.sell_type == 1 ? 1 : 0,
      "group_order_id": this.group_order_id ? this.group_order_id : 0,
      "goodCategorys": this.data.goodCategorys,
      "totalPrice": this.data.totalPrice,
      "goodSpecifications": this.data.goodSpecifications,
    };

    var self = this;
    util.ajax({
      "url": url,
      "method": "POST",
      "data": data,
      "success": function (data) {
        console.log('buyNowConfirm success', data);
        if (data['result'] == "ok") {
          //服务端生成订单成功
          //  self.setData({
          //   "btn_order_done" : false
          // });
          //微信支付
          self.order_id = data.order_id;
          // util.wxpay(self);
          self.setData({ "order_id": self.order_id });
          // wx.navigateTo({
          //   url: '../sellers?good_id=' + self.data.good_id,
          // });

          wx.navigateTo({
            url: '../orderDetail/orderDetail?id=' + data.order_id + '&good_id=' + self.data.good_id,
          });
          //self.wxpay();
        } else if (data['result'] == "fail") {

          self.setData({ "order_id": 0 });

          wx.showToast({
            title: data.error_info,
            duration: 3000,
            icon: 'none',
          });
        } else {

          self.setData({ "order_id": 0 });

          util.toast(self, util.config('error_text')[0]);
        }
      }
    });
  },
  error: function (data) {
    util.loaded(this);
    if (data['result'] == 'fail') {
      util.toast(this, data.error_info);
    }
  },
  buyNow:function(e)
  {
    if (this.buyNowCheck() == false)
    {
      return ;
    }
    else
    {
      this.buyNowConfirm();
    }
  },
  error: function (data) {
    util.loaded(this);
    if (data['result'] == 'fail') {
      util.toast(this, data.error_info);
    }
  },
  goodsDetail: function (good_id){
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=detail&goods_id=" + good_id + '&token=' + this.token;
    var self = this;
    util.ajax({
       url : url,
       success : function(data){
         console.log('goodsDetail', data);
           if(data.result == 'ok') {

             var address = data.full_address;
             var address_id = data.address_id;
             if (data.full_address == null)
             {
               address = '请编辑地址';
               address_id = 0;
             }
             self.setData({
               goods : data.goods,
               goodCategorys: JSON.parse(data.goods.goodCategorys),
               isShow_out: 0 >= parseInt(data.goods.goods_stock),
               address_id: address_id,
               address: address
             });

             var goodPrice = [];
             for (var i = 0; i < 10; i++)
             {
               if (self.data.goodCategorys[i].price != '')
               {
                 goodPrice[i] = parseInt(self.data.goodCategorys[i].price);
               }
               else
               {
                 goodPrice[i] = 0;
               }
             }
             var minPrice = goodPrice[0];
             var maxPrice = goodPrice[0];
             for (var i = 0; i < 10; i++)
             {
               if (goodPrice[i] < minPrice && goodPrice[i] != 0)
               {
                 minPrice = goodPrice[i];
               }
               else if (goodPrice[i] > maxPrice)
               {
                 maxPrice = goodPrice[i];
               }
             }

             var strPrice;
             if (minPrice == maxPrice)
             {
               strPrice = '￥' + minPrice;
               minPrice = 0;
             }
             else
             {
               strPrice = '￥' + minPrice + '~' + maxPrice;
             }
             
             for (var i = 0; i < data.gallery.length; i++) {
               self.data.galleryPreImage[i] = data.gallery[i].img_url;
             }

             for (var i = 0; i < data.galleryDetail.length; i++) {
               self.data.garreryDetailPreImage[i] = data.galleryDetail[i].img_url;
             }

             self.setData({
               goods_name: data.goods.goods_name,
               goods_desc: data.goods.goods_desc,
               goodCategorys: JSON.parse(data.goods.goodCategorys),
               isShow_out: 0 >= parseInt(data.goods.goods_stock),
               gallery: data.gallery,
               garreryDetail: data.galleryDetail,
               minPrice: parseInt(minPrice),
               maxPrice: parseInt(maxPrice),
               good_id: self.data.good_id,
               phoneNumber: data.phoneNumber,
               strPrice: strPrice
             });
             wx.setNavigationBarTitle({
               title: data.goods.goods_name//页面标题为路由参数
             });
           }
       }
    });
 },
  onLoad: function (options) {
    this.data.good_id = options.goods_id;
    if (options.scene != undefined)
    {
      var str = options.scene;
      str = str.substring(4);
      this.data.good_id = str;
    }

    this.baseApiUrl = util.config('baseApiUrl'); 
    this.token = wx.getStorageSync('token'); 
    this.goodsDetail(this.data.good_id);
  },
  swithToIndex:function()
  {
    wx.switchTab({
      url: '../homePage/homePage'
    })
  },
  maskHide:function(){
    this.data.goodSpecifications = '';
    for (var index = 0; index < 10; index++)
    {
      if (this.data.count[index] != 0)
      {
        this.data.goodSpecifications += ('规格:' + this.data.goodCategorys[index].specifications + ' ' + this.data.count[index] + '件') + ' ';
      }
    }
    this.setData({
      maskShow:'none',
      goodSpecifications: this.data.goodSpecifications
    });

  },
  maskDisplay:function() {
    this.setData({
      maskShow: 'flex'
    });
  },
  phoneNumberDisplay: function () {
    this.setData({
      showPhoneNumber: 'flex'
    });
  },
  phoneNumberHide: function () {
    this.setData({
      showPhoneNumber: 'none'
    });
  },
  shareDisplay: function () {
    this.setData({
      showShare: 'flex'
    });
  },
  shareHide: function () {
    this.setData({
      showShare: 'none'
    });
  },
  telPhone:function(){
    var that = this
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  sub:function(e){
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var count = this.data.count[index];
    if (count > 0)
    {
      this.data.count[index]--;
      this.setData({
        count: this.data.count,
        totalPrice: this.data.totalPrice - parseInt(this.data.goodCategorys[index].price)
      })
    }
  },
  plus: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var count = this.data.count[index];

    if (count < this.data.goodCategorys[index].storageInput)
    {
      this.data.count[index]++;
      this.setData({
        count: this.data.count,
        totalPrice: this.data.totalPrice + parseInt(this.data.goodCategorys[index].price)
      })
    }
    else
    {
      return false;
    }
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
  shareQCode:function()
  {
    // wx.navigateTo({
    //   url: '../share/share?good_id=' + this.data.good_id + '&image_url=' + this.data.gallery[0].img_url + '&goods_name=' + this.data.good_name + '&goods_desc=' + this.data.good_name,
    // });
    //1. 请求后端API生成小程序码
    if (this.data.good_id != undefined) {
      this.getwxacode(this.data.good_id, this.data.galleryPreImage[0], this.data.goods_name, this.data.goods_desc);
    }
    else {
      this.getwxacode();
    }
    this.shareHide();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.goods_name,
      path: '/pages/doodsDetail/goodsDetail?good_id=' + this.data.good_id,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }  
  },
  intervalChange:function(e){
  
    
  },

  drawPic: function (QRcodeImagePath, goods_name, goods_desc) {
    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('myCanvas');
    var bgImgPath = '../../images/home.png';
    var basicprofile = '../../images/home.png';
    // var xcxcode = options.goods_imgs;
    // var xcxcode = QRcodeImagePath;
    //填充背景
    // ctx.setFillStyle('#cccccc');
    // ctx.fillRect(0, 0, 650, 800);
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(1, 1, 650, 500);

    ctx.setFontSize(16);
    ctx.setFillStyle('#000000');
    ctx.fillText('门庭集市', 130, 30);
    //绘制产品图
    
    // ctx.drawImage(this.data.downloadFristPic, 70, 50, 180, 190);

    //绘制标题

    ctx.setFontSize(16);
    ctx.setFillStyle('#000000');
    ctx.fillText(goods_name, 20, 270);

    //绘制介绍价格
    ctx.setFontSize(16);
    ctx.setFillStyle('#FF0000');
    ctx.fillText(this.data.strPrice, 230, 270);


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
            url: that.data.galleryPreImage[0], //仅为示例，并非真实的资源
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
  QCodeHide:function()
  {
    this.setData({
      QCodeDisplay: "none"
    });
  },
  getwxacode: function (goods_id = '', image_url = '', goods_name = '', goods_desc = '') {
    var that = this;
    var url;
    if (goods_id == "") {
      url = this.baseApiUrl + "?g=Api&m=Weuser&a=getwxacode&token=" + this.token;
    }
    else {
      url = this.baseApiUrl + "?g=Api&m=Weuser&a=getwxacode&good_id=" + goods_id + "&token=" + this.token;
    }

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
          that.drawPic(res.filePath, goods_name, goods_desc);
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