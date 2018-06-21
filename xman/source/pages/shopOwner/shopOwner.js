var util = require('../../utils/util.js')
Page({
  data: {
    "goods_list": [],
    hidden: true,
    loaded: false,
    shopOwnerImg:"",
    nickName:"",
    shopName:"",
    shopDesc:"",
    shopImg:"",
    good_id:'',
  },
 
  onLoad: function (options) {
    this.data.good_id = options.good_id;
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
      url = this.baseApiUrl + "?g=Api&m=Weuser&a=lists&good_id=" + this.good_id + "&token=" + this.token;
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

            wx.setNavigationBarTitle({
              title: data.shopName//页面标题为路由参数
            });
            util.loaded(that);
          }
        }
      });
    }
  },
})