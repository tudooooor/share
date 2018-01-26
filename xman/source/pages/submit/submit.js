// pages/submit/submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sumFee:'￥27.6',
    addList:[1],
    maskDisplay:'none',
    imglist:["https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=7bcb659c9745d688a302b5a29cf91a23/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg"],
  },
  showMore:function(){
      var  that=this;
      that.setData({
        maskDisplay:'flex'
      })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imglist // 需要预览的图片http链接列表
      })
   }, 
  close:function(){
    var that = this;
    that.setData({
      maskDisplay: 'none'
    })
  },
  newAddress:function(){
    wx.navigateTo({
      url: '/pages/newAddress/newAddress',
    })
  },
  modify:function(){
    wx.navigateTo({
      url: '/pages/newAddress/newAddress',
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