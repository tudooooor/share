// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rolesId:'1',               //角色切换
    goods_list:[1,2,3,4,5,6],  //商品列表
    goodsNumber: 0,            //购物车内商品数量
    checkId: '1',              //侧边栏tab切换
    disContent: 'none',        //tab切换时右侧信息的展示 
    fenshu: '0',               //商品信息中的数量显示
    subDisplay: 'none',        //商品数量减少为1时隐藏该按钮
    flexDir: 'flex-end',       //只有一个+按钮时，默认右对齐
    carDisplay: 'none',        //购物车内商品数量展示的样式
    productList: [1, 2, 3, 4, 5, 6, 7, 8, 9], //购物车内的商品列表
    showCar:'none',             //显示购物车窗口
    cirDisplay:'flex'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  // 角色的切换
  selected:function(e){
     var roles_id=e.target.dataset.id;
     var that=this;
     that.setData({
       rolesId: roles_id
     })  
  },
  // 左侧tab的切换
  checked:function(ev){
    console.log(ev);
    var check_id = ev.currentTarget.dataset.id;
    console.log(check_id);
    var that = this;
    that.setData({
      checkId: check_id,
      disContent:'flex',
      cirDisplay:'flex'
    })
  },
  // 增加商品数量
  sub:function(){
    var that=this;
    var fnumber=that.data.fenshu;
    var goodsCar = that.data.goodsNumber;
    if(fnumber<=1){
      that.setData({
        fenshu: --fnumber,
        goodsNumber: --goodsCar,
        subDisplay: 'none',
        carDisplay: 'none',
        flexDir:'flex-end'
      })
      
    }else{
      that.setData({
        fenshu: --fnumber,
        goodsNumber: --goodsCar,
        subDisplay: 'flex',
        flexDir: 'space-between',
        carDisplay: 'block'
      })
    }
    
  },
  //减少商品数量  
  plus:function(){
    var that = this;
    var fnumber = that.data.fenshu;
    var goodsCar = that.data.goodsNumber;
    if (fnumber>100){
        return false;
    }else{
      that.setData({
        fenshu: ++fnumber,
        goodsNumber:++goodsCar,
        subDisplay: 'flex',
        flexDir: 'space-between',
        carDisplay: 'block'
      })
    }  
  },
  //展示购物车内的商品
  showProduct:function(){
     var that=this;
     that.setData({
       showCar:'flex'
     })
  },
  // 清空购物车
  clearAll:function(res){
    console.log(res);
    var that=this;
      wx.showModal({
        title: '是否确认清空所有',
        content: '主银~三思而后行啊', 
        success: function (res){
          console.log(res)
          if (res.confirm) {
            that.setData({
              productList:null,
              goodsNumber:'0',
              fenshu:'0',
              carDisplay:''
            })
            setInterval(function(){
              that.setData({
                showCar: 'none'
              }) 
            },100)
          }else{
            
          }
        }
      })
      
  },

  goOrder: function () {
    wx.navigateTo({
      url: '/pages/submit/submit',
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