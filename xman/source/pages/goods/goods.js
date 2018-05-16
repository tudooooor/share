var util = require('../../utils/util.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
const ImgLoader = require('../../utils/img-loader/img-loader.js')

Page({
  data:{
    indicatorDots: false,
    autoplay: false,
    interval: 3500,
    duration: 800,
    loaded: false,
    current : 1,
    fenshu: '0',               //商品信息中的数量显示
    subDisplay: 'none',        //商品数量减少为1时隐藏该按钮
    flexDir: 'flex-end'     //只有一个+按钮时，默认右对齐
  },
  onLoad:function(options){
    
     this.is_onload = 1;
     wx.hideShareMenu();
     this.goods_id = options.goods_id;
     if (options.scene != undefined)
     {
       var str = options.scene;
       str = str.substring(4);
       this.goods_id = str;
     }
    //  wx.showNavigationBarLoading();
     this.baseApiUrl = util.config('baseApiUrl'); 

     var self = this;
     util.checkNet({
       success : function() {
          util.succNetCon(self);
          self.goodsDetail(self.goods_id);
          self.goodsGroups(self.goods_id);
       },
       error : function() {
          util.notNetCon(self);
       }
     });
     this.token = wx.getStorageSync('token'); 
     // 页面初始化 options为页面跳转所带来的参数
     this.imgLoader = new ImgLoader(this)
     this.addGood(this.goods_id);
     //this.doneOrderBanner();
      //console.log(options);
    // 页面初始化 options为页面跳转所带来的参数
  },
  addGood:function(goods_id)
  {
    var self = this;
      
    // var url = this.baseApiUrl + "?g=Api&m=Weuser&a=addresses&token=" + this.token;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=addGood&goods_id=" + goods_id + "&token=" + this.token;

    util.ajax({
        "url" :  url,
        // "method" :　"POST",
        "data": {
          "offset": 0,
          "size": 20
        },
        "success" : function(data) {
            if(data['result'] == "ok") {

            }
            
        }
      });
  },
  refresh : function() {
     var self = this;
     util.checkNet({
       success : function() {
          util.succNetCon(self);//恢复网络访问
          self.goodsDetail(self.goods_id);
          self.goodsGroups(self.goods_id);
       },
       error : function() {
          util.notNetCon(self,0);
       }
     });
  },
  bindchange:function(e) {
    var current = e.detail.current + 1;
    this.setData({current : current});
  },
  onReady:function(){
    
    // 页面渲染完成
  },
  onShow:function(){  
     if(!this.is_onload) {
        this.goodsGroups(this.goods_id);
     } else { 
      this.is_onload = 0;
    }


    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
   //监听用户下拉动作
  onPullDownRefresh:function() {
    util.loadding(this,1);
    this.goodsDetail(this.goods_id);
    this.goodsGroups(this.goods_id);
    wx.stopPullDownRefresh();
  },
  goodsDetail: function (goods_id, obj = {}){

     
     var url = this.baseApiUrl + "?g=Api&m=Goods&a=detail&goods_id=" + goods_id;
     var self = this;
     util.ajax({
        url : url,
        success : function(data){
            if(data.result == 'ok') {
              self.setData({
                goods : data.goods,
                isShow_out: 0 >= parseInt(data.goods.goods_stock),
                gallery : data.gallery,
                wxParseData : WxParse.wxParse('goods_desc', 'html', data.goods.goods_desc, self, 0)
              });

              var goods_image_cache = wx.getStorageSync('goods_banner_' + data.goods.goods_id + "_windowHeight_" + self.data.windowHeight + "_windowWidth_" + self.data.windowWidth);
              if (goods_image_cache) {
                self.setData({ 'goods_banner': { "width": goods_image_cache.width + "px", "height": goods_image_cache.height + "px", "onload": 1 }, });
                util.loaded(self);

                obj.success != undefined ? obj.success() : '';
              } else {
                util.loadding(self, 1);
                self.imgLoader.load(data.gallery[0].img_url, function (err, imgs) {
                  var goods_banner = util.wxAutoImageCal(imgs.ev);
                  self.setData({ 'goods_banner': { "width": goods_banner.imageWidth + "px", "height": goods_banner.imageheight + "px", "onload": 1 }, });
                  wx.setStorageSync('goods_banner_' + data.goods.goods_id + "_windowHeight_" + self.data.windowHeight + "_windowWidth_" + self.data.windowWidth, { width: goods_banner.imageWidth, height: goods_banner.imageheight });

                  util.loaded(self);

                  obj.success != undefined ? obj.success() : '';
                });
              }
                
              wx.showShareMenu({withShareTicket: true});
              
            } else {
              util.notNetCon(self,1,1);
              self.error(data);
            }
        }
     });
  },
  goodsGroups:function(goods_id) {
    var url = this.baseApiUrl + "?g=Api&m=Goods&a=groups&goods_id=" + goods_id;
    var self = this;

    var data = [];
    data['offset'] = 0;
    data['size'] = 5;
    util.ajax({
       url : url,
       data : data,
       success : function(data) {
          if(data.result == 'ok') {

            var times = [];
            var i = 0
            
            var goods_groups = data.goods_groups.map(function(group) {
            // 清除定时器
              times[i++] =  (group.expire_time - new Date().getTime() / 1000) * 1000;
            });
            self.setData({'groups' : data});

            if(self.timer) clearTimeout(self.timer);
            util.countdowns(self,times);
          } else {
            self.error(data);
          }
       }
    });
  }
  ,
 loadding:function() {
    util.loadding(this);
    //this.setData({page : {load : 0}});
 },
 loaded : function() {
    util.loaded(this);
    //this.setData({page : {load : 1}});
 },
  //错误处理函数
  error:function(data) {
    this.loaded();
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    }
  },
  cusImageLoad: function (e){
    var that = this;
    console.log(util.wxAutoImageCal(e));
    that.setData(util.wxAutoImageCal(e));
  },
  onShareAppMessage: function () {
    return getApp().share({title : this.data.goods.goods_name,path : "pages/goods/goods?goods_id=" + this.goods_id});
  },
  tohomePage:function(e) {
    wx.switchTab({
      url: '../homePage/homePage'
    })
  },
  show_group_desc : function(e) {
    this.setData({
      "show_group_desc" : 1
    });
  },
  close_group_desc : function(e) {
    this.setData({
      "show_group_desc" : 0
    });
  },

  showMobile : function(e) {
    this.setData({
      "showMobile" : 1
    });
  },
  closeMobile : function(e) {
    this.setData({
      "showMobile" : 0
    });
  },

  show_service_detail : function(e) {
     this.setData({
      "service_detail" : 1
    });
  },
  close_service_detail : function(e) {
    this.setData({
      "service_detail" : 0
    });
  },
  show_group_list : function(e) {
     this.setData({
        "show_group_list" : 1
    });
  },
  close_group_lists : function(e) {
     this.setData({
        "show_group_list" : 0
    });
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

  previewImage : function(e) {
    var idx = e.currentTarget.dataset.idx;
    var gallery = [];
    
    for(var i=0;i<this.data.gallery.length;i++) {
      gallery[i] = this.data.gallery[i].img_url;
    }
    
    wx.previewImage({
      current: gallery[idx], 
      urls: gallery 
    })
  },
})