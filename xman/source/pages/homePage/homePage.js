var util = require('../../utils/util.js');
const ImgLoader = require('../../utils/img-loader/img-loader.js')
// pages/homePage/homePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../utils/images/1.jpg',
      '../../utils/images/2.jpg',
      '../../utils/images/3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    colorSel:"#eeeceb",
    shopList:[1],
    flower:[1,2,3,4],
    discount:7,
    goods: false
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  look:function(){
    wx.navigateTo({
      url: '/pages/businessInfo/businessInfo',
    })
  },
  selectFruits:function(){
    wx.setNavigationBarTitle({
      title:'获取该ID下的店名'
    })
  },
  viewMenu:function(){
    wx.navigateTo({
      url: '/pages/menu/menu',
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
        },
        refresh : function() {
        }
     });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
// 下拉刷新  
  onPullDownRefresh:function() {
    // wx.showNavigationBarLoading();
    this.refresh();
    wx.stopPullDownRefresh();
     wx.hideShareMenu();
     var self = this;
     self.getConfig();
     util.checkNet({
        success : function() {
          util.succNetCon(self);
          self.goodsCate();
        },
        // error : function() {
        //   util.notNetCon(self,1);
        // }
     });
  },
  //refresh
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
    //  util.checkNet({
    //    success : function() {
    //       if(self.data.notNetCon.error) {
    //          util.succNetCon(self);
    //          self.goodsCate();
             
    //          //self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
    //       } else {
    //          self.setData({'goods' : false,'is_over' : 0,'no_data' : 0,"scroll_Top" : -Math.random(),"pullDown" : 0,"banners" : []});
    //          self.page = 1;
    //          self.goodsList();

    //          util.loaded(self);
    //       }
    //     },
    //   // error : function() {
    //   //   self.setData({goods : false});
        
    //   //   util.notNetCon(self,0);
    //   // }
    // });     
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
  // error:function(data) {
  //   this.setData({page : {load : 1}});
  //   if(data['result'] == 'fail') {
  //      util.toast(this,data.error_info);
  //   }
  // },

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