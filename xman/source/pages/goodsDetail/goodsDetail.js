var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskShow:'none',
    numberGoods:10,
    goods:[],
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindchange:function(e) {
    var current = e.detail.current + 1;
    this.setData({current : current});
  },
  goodsDetail: function (goods_id){
    var url = this.baseApiUrl + "?g=Api&m=Goods&a=detail&goods_id=" + goods_id;
    var self = this;
    util.ajax({
       url : url,
       success : function(data){
           if(data.result == 'ok') {
             self.setData({
               goods : data.goods,
               isShow_out: 0 >= parseInt(data.goods.goods_stock),
               gallery : data.gallery,
             });

           } else {
             self.error(data);
           }
       }
    });

 },
  onLoad: function (options) {
    this.is_onload = 1;
    wx.hideShareMenu();
    this.goods_id = options.goods_id;
    this.goods_name = options.goods_name;
    if (options.scene != undefined)
    {
      var str = options.scene;
      str = str.substring(4);
      this.goods_id = str;
    }
   //  wx.showNavigationBarLoading();
    this.baseApiUrl = util.config('baseApiUrl'); 
    this.token = wx.getStorageSync('token'); 
    this.goodsDetail(this.goods_id);
    wx.setNavigationBarTitle({
      title: this.goods_name//页面标题为路由参数
    });
    // var self = this;
    // util.checkNet({
    //   success : function() {
    //      util.succNetCon(self);
    //      self.goodsDetail(self.goods_id);
    //      self.goodsGroups(self.goods_id);
    //   },
    //   error : function() {
    //      util.notNetCon(self);
    //   }
    // });

    // 页面初始化 options为页面跳转所带来的参数
    // this.imgLoader = new ImgLoader(this)
    // this.addGood(this.goods_id);
  },

  maskHide:function(){
    var that = this;
    that.setData({
      maskShow:'none'
    });
  },
  
  maskDisplay:function() {
    var that = this;
    that.setData({
      maskShow: 'flex'
    });
  },
  sub:function(){
    var that = this;
    if (numberGoods>0){
      that.setData({
        numberGoods: --numberGoods
      })
    }else{
      return false;
    }
  },
  plus: function () {
    var that = this;
    if (numberGoods > 0) {
      that.setData({
        numberGoods: ++numberGoods
      })
    } else {
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
  
  },
  intervalChange:function(e){
    
    
  }
})