var util = require('../../utils/util.js');

// pages/homePage/homePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< .mine
    imgUrls: [
      '../../utils/images/1.jpg',
      '../../utils/images/2.jpg',
      '../../utils/images/3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goods_list:[{}],
    // hidden: true,
    // loaded: false,
    shopOwnerImg:"",
    userImage:"",
    nickName:"",
    shopName:"",
    shopDesc:"",
    shopImg:"",
||||||| .r194
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
=======
  shopData:[],

>>>>>>> .r195
  },


  /**
   * 生命周期函数--监听页面卸载
   */
onLoad:function(options){
     this.token = wx.getStorageSync('token'); 
     this.baseApiUrl = util.config('baseApiUrl'); 
     this.goodslists();
  },

goodslists:function() {

    var that = this;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=shoplist&token=" + this.token;
    util.ajax({
      "url": url,
      "data": {
        "offset": 0,
        "size": 20
      },
      "success": function (data) {
          that.setData({
            "shopData": data,
          });
      }
    });
  },


  loaded : function() {this.setData({page : {load : 1}});},
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