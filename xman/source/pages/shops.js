var util = require('../utils/util.js')
Page({
  data: {
    "goods_list": [],
    title: "",
    hidden: true,
    loaded: false
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
          if (data['result'] == "ok") {
            that.setData({
              "goods_list": data.goods,
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