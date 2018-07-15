var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskShow:'none',
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
    address:'',
    address_id:'',
    failInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  previewImage:function(e)
  {
    wx.previewImage({
      current: this.data.galleryPreImage[this.data.swiperCurrent - 1], // 当前显示图片的http链接
      urls: this.data.galleryPreImage // 需要预览的图片http链接列表
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
    if (this.data.address_id == '') {
      this.data.failInfo = '请填写地址';
    }
    else if (this.data.goodSpecifications == '')
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
      "group_order_id": this.group_order_id ? this.group_order_id : 0
    };

    var self = this;
    util.ajax({
      "url": url,
      "method": "POST",
      "data": data,
      "success": function (data) {
        if (data['result'] == "ok") {
          //服务端生成订单成功
          //  self.setData({
          //   "btn_order_done" : false
          // });
          //微信支付
          self.order_id = data.order_id;
          // util.wxpay(self);
          self.setData({ "order_id": self.order_id });
          wx.navigateTo({
            url: '../sellers?good_id=' + self.data.good_id,
          });
          //self.wxpay();
        } else if (data['result'] == "fail") {

          self.setData({ "order_id": 0 });

          util.toast(self, data.error_info);
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
      var that = this;
      wx.showModal({
        title: '是否确定下单',
        content:'下单后，下载商家二维码进行支付',
        success: function (res) {
          if (res.confirm) {
            that.buyNowConfirm();
          } else if (res.cancel) {
          }
        }
        
      });
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
           if(data.result == 'ok') {
             self.setData({
               goods : data.goods,
               goodCategorys: JSON.parse(data.goods.goodCategorys),
               isShow_out: 0 >= parseInt(data.goods.goods_stock),
               gallery : data.gallery,
               garreryDetail: data.galleryDetail,
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
             if (minPrice == maxPrice)
             {
               minPrice = 0;
             }

             for (var i = 0; i < data.gallery.length; i++) {
               self.data.galleryPreImage[i] = data.gallery[i].img_url;
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
               good_id: self.data.good_id
             });
             wx.setNavigationBarTitle({
               title: data.goods.goods_name//页面标题为路由参数
             });
           } else {
             self.error(data);
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

   //  wx.showNavigationBarLoading();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: goods_name,
      path: '/pages/doodsDetail/goodsDetail?good_id=' + good_id,
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
  
})