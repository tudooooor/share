// pages/goods/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auto_style_0:'height:100%',
    auto_style_1:'height:80%;margin-top:7%',
    auto_style_2:'height:80%;margin-top:7%',
    maskShow:'none',
    numberGoods:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    console.log(e.detail.current);
    if (e.detail.current==0){
      this.setData({
        auto_style_0: 'height:100%',
        auto_style_1: 'height:80%;margin-top:7%',
        auto_style_2: 'height:80%;margin-top:7%'
      })
    } else if (e.detail.current == 1){
      this.setData({
        auto_style_0: 'height:80%;margin-top:7%',
        auto_style_1: 'height:100%',
        auto_style_2: 'height:80%;margin-top:7%'
      })
    }else{
      this.setData({
        auto_style_0: 'height:80%;margin-top:7%',
        auto_style_1: 'height:80%;margin-top:7%',
        auto_style_2: 'height:100%'
      })
    }
    
  }
})