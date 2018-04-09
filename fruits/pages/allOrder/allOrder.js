// pages/allOrder/allOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all:[1,2,3],
    delive:[1,2,3],
    display1:'none',
    check_id:'1',
    sel_id:'',
    show1:'block',
    show2:'none',
    show3: 'none',
    show4: 'none',
    show5: 'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  sel:function(e){
    var that = this;
    var sel_id = e.target.dataset.id;
    that.setData({
      sel_id: sel_id
    })
    if(sel_id==1){
      
    }
  },
  checked:function(e){
    var that=this;
    var check_id = e.target.dataset.id;
    that.setData({
      check_id:check_id
    })
    console.log(check_id)
    if(check_id==1){
      that.setData({
        show1:'block',
        show2: 'none',
        show3: 'none',
        show4: 'none',
        show5: 'none'
      })
    }else if(check_id==2){
      that.setData({
        show1: 'none',
        show2:'block',
        show3: 'none',
        show4: 'none',
        show5: 'none'
      })
    }else if(check_id==3){
      that.setData({
        show1: 'none',
        show2: 'none',
        show3: 'block',
        show4: 'none',
        show5: 'none'
      })
    } else if (check_id == 4) {
      that.setData({
        show1: 'none',
        show2: 'none',
        show3: 'none',
        show4: 'block',
        show5: 'none'
      })
    } else if (check_id == 5) {
      that.setData({
        show1: 'none',
        show2: 'none',
        show3: 'none',
        show4: 'none',
        show5: 'block'
      })
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
  
  }
})