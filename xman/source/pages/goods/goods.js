// pages/buyNow/buyNow.js
var util = require('../../utils/util.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
const ImgLoader = require('../../utils/img-loader/img-loader.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    colorSel: "#eeeceb",
    shopList: [1, 2, 3, 4, 5, 6],
    flower: [1, 2, 3, 4],
    discount: 7,
    proList: [1, 2, 3,4],
    loaded: false,
    current : 1,
    fenshu: '0',               //商品信息中的数量显示
    subDisplay: 'none',        //商品数量减少为1时隐藏该按钮
    flexDir: 'flex-end'     //只有一个+按钮时，默认右对齐
  },

  goodsDetail: function (goods_id, obj = {}){

     
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
                wxParseData : WxParse.wxParse('goods_desc', 'html', data.goods.goods_desc, self, 0)
              });

              var goods_image_cache = wx.getStorageSync('goods_banner_' + data.goods.goods_id + "_windowHeight_" + self.data.windowHeight + "_windowWidth_" + self.data.windowWidth);
              if (goods_image_cache) {
                self.setData({ 'goods_banner': { "width": goods_image_cache.width + "px", "height": goods_image_cache.height + "px", "onload": 1 }, });
                util.loaded(self);

                obj.success != undefined ? obj.success() : '';
              } else {
                util.loadding(self, 1);
                self.imgLoader.load(data.gallery[0].img_url, function (err, imgs) {
                  var goods_banner = util.wxAutoImageCal(imgs.ev);
                  self.setData({ 'goods_banner': { "width": goods_banner.imageWidth + "px", "height": goods_banner.imageheight + "px", "onload": 1 }, });
                  wx.setStorageSync('goods_banner_' + data.goods.goods_id + "_windowHeight_" + self.data.windowHeight + "_windowWidth_" + self.data.windowWidth, { width: goods_banner.imageWidth, height: goods_banner.imageheight });

                  util.loaded(self);

                  obj.success != undefined ? obj.success() : '';
                });
              }
                
              wx.showShareMenu({withShareTicket: true});
              
            } else {
              util.notNetCon(self,1,1);
              self.error(data);
            }
        }
     });
  },



  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  getSelectItem: function (e) {
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.proList.length;//每个商品的宽度
    var scrollLeft = e.detail.scrollLeft;//滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth);//通过Math.round方法对滚动大于一半的位置进行进位
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
      that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    that.setData({
      proList: that.data.proList,
      giftNo: this.data.proList[curIndex].id
    });
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