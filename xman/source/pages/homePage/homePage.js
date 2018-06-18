var util = require('../../utils/util.js')
const ImgLoader = require('../../utils/img-loader/img-loader.js')
Page({
  data: {
    imgUrls: [
      '../../utils/images/1.jpg',
      '../../utils/images/2.jpg',
      '../../utils/images/3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    "goods_list": [3],
    // hidden: true,
    // loaded: false,
    shopOwnerImg:"",
    userImage:"",
    nickName:"",
    shopName:"",
    shopDesc:"",
    shopImg:"",
  },

    changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
 
  onLoad: function (options) {

    if (options.good_id != undefined)
    {
      this.good_id = options.good_id;
    }
    else  if (options.scene != undefined) {
      var str = options.scene;
      str = str.substring(4);
      this.member_id = str;
    }

    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');


    this.getGoodsFromOwner();

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
    this.getGoodsFromOwner();
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
  getGoodsFromOwner: function () {
  {
      var that = this;
      var url;
      // url = this.baseApiUrl + "?g=Api&m=Weuser&a=goodslists&good_id=" + this.good_id + "&token=" + this.token;

      url = this.baseApiUrl + "?g=Api&m=Weuser&a=goodslists&token=" + this.token;
      util.ajax({
        "url": url,
        "data": {
          "offset": 0,
          "size": 20
        },
        "success": function (data) {
          if (data['result'] == "ok") {
            that.setData({
              "goods_list": data.goods,
              nickName: data.nickName,
              shopOwnerImg: data.shopOwnerImg,
              shopName:data.shopName,
              shopDesc:data.shopDesc,
              shopImg:data.shopImg,
            });
            util.loaded(that);
          }
        }
      });
    }
  },
})