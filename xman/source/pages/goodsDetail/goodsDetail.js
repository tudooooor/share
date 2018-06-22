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
    this.data.goodSpecifications = '';
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
    
    
  }
})