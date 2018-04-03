// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rolesId:1,
    disList:[1,2,3],
    detaiilShow:'none',
    telNo:1664545456785,
    statusDisplay:'block',
    statusId:1,
    timeF:'2017-12 - 22 09: 07:10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  // 角色的切换
  selected: function (e) {
    var roles_id = e.target.dataset.id;
    var that = this;
    that.setData({
      rolesId: roles_id
    })
    if (roles_id==1){
      that.setData({
        statusDisplay: 'block',
        detaiilShow: 'none',
      })
    }else{
      that.setData({
        statusDisplay: 'none',
        detaiilShow: 'block',
      })
    }
  },
  call:function(){
    wx.showActionSheet({
      itemList: ['商家电话：156356464664', '客服电话：15121545212'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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