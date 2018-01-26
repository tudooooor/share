// pages/manageBus/manageBus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rolesId: '1',               //角色切换
    goods_list: [1,2,3,4,5,6],  //商品列表
    goodsNumber: 0,            //购物车内商品数量
    checkId: '1',              //侧边栏tab切换
    disContent: 'none',        //tab切换时右侧信息的展示 
    boxOne:'block',
    boxTwo:'none',
    viewId:1,
    commentList:[1,2,3,4,5,6]
    // flower:[1,2,3,4]
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
    });
    if (roles_id==1){
      that.setData({
        boxOne: 'block',
        boxTwo: 'none'
      });
    }else{
      that.setData({
        boxOne: 'none',
        boxTwo: 'block'
      })
    }
  },
  // 左侧tab的切换
  checked: function (ev) {
    console.log(ev);
    var check_id = ev.currentTarget.dataset.id;
    console.log(check_id);
    var that = this;
    that.setData({
      checkId: check_id,
      disContent: 'flex',
      cirDisplay: 'flex'
    })
  },
  viewOne:function(eve){
    var view_id = eve.currentTarget.dataset.id;
    var that = this;
    that.setData({
      viewId: view_id,
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