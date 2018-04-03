var util = require('../../utils/util.js');
const ImgLoader = require('../../utils/img-loader/img-loader.js')

Page({
  data:{
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
      "URL" : 1,
      'autoplay': true,
      'interval': 5000,
      'duration': 500,
      'loaded': false,
      'indicator-dots' : false,
      "is_over" : false,
      "no_data" : false,
      "goods_img" : {
        "imageWidth" : 0,
        "imageheight" : 0
      },
      "banner_img" : {
        "imageWidth" : 0,
        "imageheight" : 0
      },
      "nav_scroll_left" : 0,
      "page_cate" : [],
      "current" : 1,
      rolesId:'1',               //角色切换
      goods_list:[1,2],  //商品列表
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
  onLoad:function(options){
      
     wx.hideShareMenu();

     var self = this;
     
     self.getConfig();
     this.token = wx.getStorageSync('token'); 
     util.checkNet({
        success : function() {
          util.succNetCon(self);
          self.goodsCate();
          //self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
        },
        error : function() {
          util.notNetCon(self,1);
        }
     });
  },
  getConfig:function() {
     this.baseApiUrl = util.config('baseApiUrl'); 
     this.size = util.config('page_size');
     this.offset = util.config('page_offset');
     this.page = 1;

     this.setData({
       "pullload_text" :  util.config('pullload_text')
     });
  },
  pullDown: function( e ) {
    if (this.data.is_over == 1) return false;
    this.setData({ "pullDown": 1, "is_scroll": false });
    this.page = this.page + 1;
    this.goodsList();
  },
  pullUpLoad: function(e) {
    
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

  goTop: function(e) {
    this.setData({
      "scroll_Top" : -Math.random()
    });
  },
  scroll:function(e) {
    if(this.data.windowHeight < e.detail.scrollTop) {
       this.setData({"goTopClass" : 'top-button-show-nav'});
    } else {
      this.setData({"goTopClass" : 'top-button-hide'});
    }
  },
  onReady:function(){},
  onShow:function(){
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  onHide:function(){},
  onUnload:function(){},

  onPullDownRefresh:function() {
     wx.hideShareMenu();
     var self = this;
     self.getConfig();
     util.checkNet({
        success : function() {
          util.succNetCon(self);
          self.goodsCate();
          //self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
        },
        error : function() {
          util.notNetCon(self,1);
        }
     });
  },
  error:function(data) {
    this.setData({page : {load : 1}});
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    }
  },
  bannerList:function() {
    var url = this.baseApiUrl + "?g=Api&m=Banner&a=lists";
    
    var self = this;
    var page = 0;
    if(this.cate_id != undefined) {
       page = this.cate_id;
    }

    if(self.pagedata == undefined) {
      self.pagedata  = {};
    }

    if(self.pagedata != undefined && self.pagedata[page] != undefined) {
      var pagedata = self.pagedata[page];
      var agoData = page.goods;
    } else {
      self.pagedata[page] = {};
    }
   
    util.ajax({
      "url" :  url,
      "success" : function(data) {
          self.pagedata[page].banners = data.banners;
          self.setData({
            "banners" : data.banners
          });
        }
     });
  },   
  goodsList:function() {
    if(this.data.no_data) return true;
    var offset = (this.page - 1) * this.size;
    var size = this.size;
    var data = {
      "offset" : offset,
      "size" : size
    };

    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=goodslists&token=" + this.token;
    
    var page = 0;
    if(this.cate_id != undefined && this.cate_id != 0) {
       data.parent_cate = this.cate_id; 
       page = this.cate_id;
    } 

    if(offset == 0 && this.cate_id) {
      util.loadding(this,1); 
    }
    
    var self = this;
 

    util.ajax({
      "url" : url,
      "data" : data,
      "success" : function(data){
         wx.showShareMenu({withShareTicket: true});
         if(page == 0 && self.cate_id == 0) {
           self.bannerList();
         }   
         var allData = '';

         if(self.pagedata == undefined) {
            self.pagedata  = {};
         }

         
         if(self.pagedata != undefined && self.pagedata[page] != undefined) {
            var pagedata = self.pagedata[page];
            if (self.page == 1) {
              var agoData = pagedata.goods;
            } else {
              var agoData = self.data.goods;
            }       
         } else {
            self.pagedata[page] = {};
         }
          
        var goods = data.goods;
        if(data.goods != null && data.goods.length != 0) {
            if(data.goods.length < self.size) {
              self.setData({ "is_over": 1, "no_data": 1 });
              if (self.page == 1) {
                self.pagedata[page].is_over = 0;
                self.pagedata[page].no_data = 0;
              }
            }
            
            /*
            if(agoData) {
              allData = agoData;
              goods.map(function(good) {
                allData.push(good);
              });
            } else {
              allData = goods;
            }*/
            if (agoData) {
              allData = agoData.concat(goods);
            } else {
              allData = goods;
            }

            if (self.page == 1 && allData.length > 0) {
              self.pagedata[page].goods = goods;
              self.pagedata[page].p = self.page;
            }
                
            self.setData({goods : allData});
            //self.loadImages();
        }  else {
          if(self.data.goods == false) {
            self.setData({goods : []});
            self.pagedata[page].goods = [];
          }
          self.setData({
            "is_over" : 1,
            "no_data" : 1
          });

          if (self.page == 1) {
            self.pagedata[page].is_over = 0;
            self.pagedata[page].no_data = 0;
          }
        } 

        self.setData({ is_scroll: true });
        self.setData({ loaded: true });
      }
    });
  },
  cusImageLoad: function (e){

    var id = e.currentTarget.dataset.id;
    var that = this;
    var data = {};
    
    if( data[id] == undefined) {
      data[id] = util.wxAutoImageCal(e);
      that.setData(data);
      this.setData({'image_load' : 1});
    }
    util.loaded(this);
  },
  cusImageGoods:function (e){
      var that = this;
      that.setData(util.imageUtil(e));
  },
  goodsCate:function(e){
    var offset = 0;
    var size = 100;
    var data = {
      "offset" : offset,
      "size" : size
    };
    var url = this.baseApiUrl + "?g=api&m=goodsCate&a=lists";
    var self = this; 
    util.ajax({
      "url" : url,
      "data" : data,
      "success" : function(data){
        self.loaded();
        if(data.result == 'ok') {
           self.cate_id = 0;
           self.goodsList(); 
           self.setData({
              "cates" : data.cates
           });
        }
      }
    });
  },
  loadding:function() {this.setData({page : {load : 0}});},
  loaded : function() {this.setData({page : {load : 1}});},
  channelRendered:function(e) {   
    var nav_scroll_left = 0;
    this.cate_id = e.currentTarget.dataset.cate_id;
    this.current_index = e.currentTarget.dataset.index;
    var nav_temp = 0;

    this.setData({ "scroll_Top": 0, "pullDown": 0, "goods": false, "is_scroll": true });

    var plus = 30;
    if (this.current_index != -1) {
      var plus = 10 * this.data.cates[this.current_index].cate_name.length;
    }

    var nav_scroll_left = (e.currentTarget.offsetLeft - (this.data.windowWidth / 2) + plus);
    this.setData({ 'nav_scroll_left': nav_scroll_left });

    this.setData({ "current_index": this.current_index });

    var page = 0;
    if (this.cate_id != undefined) { page = this.cate_id; }
    if (this.pagedata == undefined || this.pagedata[page] == undefined) { util.loadding(this, 1); }

    this.refresh();    
  },
  refresh:function() {
     var page = 0;
     var self = this;

     if (this.cate_id != undefined) { page = this.cate_id; }
     if (this.pagedata != undefined && this.pagedata[page] != undefined && this.pagedata[page].goods != undefined) {
       wx.showShareMenu({ withShareTicket: true });

       if (this.pagedata[page].is_over == undefined || this.pagedata[page].no_data == undefined) {
         this.pagedata[page].is_over = false;
         this.pagedata[page].no_data = false;
       }
       this.page = this.pagedata[page].p;
       this.setData(this.pagedata[page])
       util.loaded(this);

       return;
     }

     util.loadding(this,1);
     util.checkNet({
       success : function() {
          if(self.data.notNetCon.error) {
             util.succNetCon(self);
             self.goodsCate();
             
             //self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
          } else {
             self.setData({'goods' : false,'is_over' : 0,'no_data' : 0,"scroll_Top" : -Math.random(),"pullDown" : 0,"banners" : []});
             self.page = 1;
             self.goodsList();

             util.loaded(self);
          }
        },
      error : function() {
        self.setData({goods : false});
        
        util.notNetCon(self,0);
      }
    });     
  },  
  onShareAppMessage: function () {return getApp().share({title : "",desc : "",path : ""});},
  bindRedirect:function(e) {
    var url = e.currentTarget.dataset.url;
    if(!url) return false;

    wx.navigateTo({"url": url})
  },
  bannerDetail:function(e) {
    var index = e.target.dataset.index;
    var url = this.data.banners[index].target_url;
    if(!url) return false;
    if(this.data.banners[index].banner_type == '0') return false;

    wx.navigateTo({url: url})
  },
  bindchange:function(e) {
    var current = e.detail.current + 1;

    this.setData({current : current});
  },
})