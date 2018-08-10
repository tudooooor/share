// pages/orderDetail/orderDetail.js
var util = require('../../utils/util.js')
var adds = { order_id:'', "image_urls": [], order_imgs: []};
var order_imgs_temp = [];
Page({
  data:{
    rolesId:1,
    disList:[1,2,3],
    detaiilShow:'none',
    telNo:16645454567,
    statusDisplay:'block',
    statusId:1,
    timeF:'2017-12 - 22 09: 07:10',
    order : [],
    URL :　3,
    modalHidden : true,
    isSeller: 0,
    img_arr: [],
    tempImages: [],
    currentImg: 0,
    isSubmitDisable: false,
    submitTimes: 0
  },
  
  onLoad:function(options){
      this.is_onload = 1;
      this.loadding();
      this.id = options.id;
      if (true == options.isSeller)
      {
        this.isSeller = true;
      }
      var self = this;

      this.getConfig();

      if(this.id == undefined) {
          this.error({result:'fail',error_info:'该订单不存在,请刷新该订单!'});
          util.notNetCon(self,1,1);
          return false;
      }
      util.checkNet({
        success : function() {
           util.succNetCon(self);
           var orders = self.getData();//token,this.offset,this.size
        },
        error : function() {
          util.notNetCon(self,1);
        }
     });
    // 页面初始化 options为页面跳转所带来的参数
  },
  swiperChange: function (e) {
    if (this.data.currentImg > 0) {
      var tempImage = this.data.img_arr;
      tempImage.splice(this.data.currentImg, 1);
      this.setData({
        img_arr: tempImage,
        currentImg: 0,
      });
    }
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  deleteImage: function (e) {
    var tempImage = this.data.img_arr;

    if (tempImage.length == (this.data.swiperCurrent + 1)) {
      delete tempImage[this.data.swiperCurrent];
      this.setData({
        currentImg: (tempImage.length - 1)
      });
    }
    else {
      tempImage.splice(this.data.swiperCurrent, 1);
    }

    this.setData({
      img_arr: tempImage
    });

  },
  formSubmit: function (e) {
    if (this.data.isSubmitDisable == true) {
      wx.showToast({
        title: '已提交,请稍等！',
        duration: 3000
      });
    }

    if (this.data.img_arr.length == 0) {
      wx.showToast({
        title: '请选择图片',
        duration: 3000
      });
      return;
    }

    this.setData({ isSubmitDisable: true });

    this.sendImages();
  },
  upimg: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function (res) {
        that.setData({
          img_arr: that.data.img_arr.concat(res.tempFilePaths)
        })
      }
    });
  },
  sendImages: function () {
    var urls = this.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + this.token;
    this.data.tempImages = [];
    adds.order_id = this.id;
    var count = 0;
    for (var i = 0; i < this.data.img_arr.length; i++) {
      if (this.data.img_arr[i].indexOf("Uploads") == -1) {
        this.data.tempImages.push(this.data.img_arr[i]);
      }
      else {
        count++;
      }
    }

    if (count == this.data.img_arr.length) {
      urls = this.baseApiUrl + "?g=Api&m=Weuser&a=uploadOrderImg&token=" + this.token;
      adds.order_imgs = JSON.stringify(this.data.img_arr);
      var that = this;
      wx.request({
        url: urls,
        method: 'POST',
        data: adds,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res) {
            wx.showToast({
              title: '已提交发布！',
              duration: 3000
            });
          }
          console.log(res);
        },
        fail: function (res) {
          console.log(res);
          that.data.isSubmitDisable = true;
        }
      });
    }
    else {
      this.upload(0, this.data.tempImages.length , urls);
    }
  },
  upload: function (index, uploadCount, urls) {
    var that = this;
    var filePath = that.data.tempImages[index];

    wx.uploadFile({
      url: urls,//'http://127.0.0.1/weipin-admin/',
      filePath: filePath,
      name: 'file',
      header: { "Content-Type": "application/json" },
      // formData: adds,
      success: function (res) {
        if (res.data != "") {
          var data = JSON.parse(res.data);
            order_imgs_temp[index] = data["url"];
        }
        console.log(res)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        index++;
        if (index < uploadCount) {
          var urls = that.baseApiUrl + "?g=Api&m=Weuser&a=upload1&token=" + that.token;
          that.upload(index, uploadCount, urls);
        }
        else if (index == uploadCount) {
          var urls;

          urls = that.baseApiUrl + "?g=Api&m=Weuser&a=uploadOrderImg&token=" + that.token;
          for (var i = 0; i < that.data.img_arr.length; i++) {
            if (that.data.img_arr[i].indexOf("Uploads") != -1) {
              order_imgs_temp.push(that.data.img_arr[i]);
            }
          }

          adds.order_imgs = JSON.stringify(order_imgs_temp);

          wx.request({
            url: urls,
            method: 'POST',
            data: adds,
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res) {
                wx.showToast({
                  title: '已提交发布！',
                  duration: 3000
                });
              }
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
              that.data.isSubmitDisable = true;
            }
          });
        }

        // adds.order_imgs = [];
        // order_imgs_temp = [];
        
        console.log(res);
      }
    });

    this.setData({
      formdata: ''
    })
  },
  // 角色的切换
  selected:function(e) {
    var roles_id = e.target.dataset.id;
    var that = this;
    that.setData({rolesId: roles_id})
    if (roles_id==1)
    {
      that.setData({
        statusDisplay: 'block',
        detaiilShow: 'none',
      })
    }else
    {
      that.setData({
        statusDisplay: 'none',
        detaiilShow: 'block',
      })
    }
  },
  //配置方法
  getConfig:function() {
     var token = wx.getStorageSync('token');
     this.baseApiUrl = util.config('baseApiUrl'); 
     this.size = util.config('page_size');
     this.offset = util.config('page_offset');
     this.token = token;
     this.page = 1;
     this.order_status = util.config('order_status');
  },
  loadding:function() {
    util.loadding(this);
  },
  loaded : function() {
    util.loaded(this);
  },
  getData:function() {
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getorder";  
    var token = this.token;
    var data = {
      "token" : token,
      "order_id" : this.id,
      "isSeller": this.isSeller,
    };

    var self = this;
     util.ajax({
        url : url,
        data : data,
        method : "GET",
        success : function(data){
            self.loaded();
            if(data.result == 'ok') {
                var order = data.order;
                order.pay_time = util.formatTime(new Date(order.pay_time * 1000));
                order.order_time = util.formatTime(new Date(order.order_time * 1000));
                order.order_status_lang = self.order_status[order.order_status];
                
                if(order.order_status == '0' || order.order_status == '1' || order.order_status == '2'  ) {
                    order.state_class = "state_1";
                } else if(order.order_status == '3') {
                   order.state_class = "state_2";
                } else if(order.order_status == '4') {
                   order.state_class = "state_3";
                }
                self.setData({"order" : order});
            } else {
               util.notNetCon(self,1,1);
               self.error(data);
               return false;
            }
        }
     });
  },
  orderBuy:function(e) {
     if(this.data.btn_order_done) return true;
     this.setData({
      "btn_order_done" : true
    });
    this.order_id = e.currentTarget.dataset.order_id;
    util.wxpay(this);
    this.order_id = false;
  },
   //取消訂單
  orderCancel:function(e) {
    this.order_id = e.currentTarget.dataset.order_id;
    
    var self = this;
    
    wx.showModal({
      title: '确定“取消订单”吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
           self.modalConfirm();
        } 
      }
    })

  },
  modalConfirm:function(e) {
    var self = this;
    if(this.order_id == undefined) {
       return false;
    }
    var token = this.token;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=cancelOrder";   
   
    var data = {
      token:  token,
      order_id: this.order_id
    };
    util.loadding(self,1);
    util.ajax({
        "url" :  url,
        "method" :　"GET",
        "data" : data,
        "success" : function(data) {
            if(data['result'] == "ok") {
              util.toast(self,'订单取消成功');
              self.loaded();
              self.refresh();
            } else {
               self.error(data);
            }  
        }
      });
    this.order_id = undefined;
  },
  modalCancel:function(e) {
     this.setData({
      'modalHidden' : true
    });
    this.order_id = undefined;
  },
  refresh:function(e){
    var self = this;
    util.checkNet({
      success : function() {
         util.succNetCon(self);
         var orders = self.getData();//token,this.offset,this.size
      },
      error : function() {
        util.notNetCon(self,0);
      }
   });
  },
  //监听用户下拉动作
  onPullDownRefresh:function() {
    this.getData();
    wx.stopPullDownRefresh();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
     if(!this.is_onload) {
        var orders = this.getData();
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
  error:function(data) {
    this.loaded(); 
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    } 
  },
  expressShow : function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    
    this.setData({"expressOpen" : 1,'express' : {loading : true}});
    var order_id = e.currentTarget.dataset.order_id;

    var token = this.token;
    var url = this.baseApiUrl + "?g=Api&m=Project&a=express&order_id=" +　order_id;   
    var self = this;
    util.ajax({
        "url" :  url,
        "method" :　"GET",
        "data" : [],
        "success" : function(data) {
        if(data['result'] == "ok") {
          self.setData({
                 'express' : {loading : false},
                 "shipping_info" : data.shipping
                });
             } else {
                  self.setData({
                    'express' : {
                     "loading" : false,"error" : 1,"info" : util.config('error_text')[8]}
                   });
             }  
         }
       });
  },
  close_express: function () {
    this.setData({
      'expressOpen': 0,
      'shipping_info': {},
      'express': { "loading": false }
    });
  }
  ,
  orderReceive : function(e) {
      this.order_id = e.currentTarget.dataset.order_id;
      var self = this;
      wx.showModal({
        title: '确定“确认收货”吗？',
        content: '',
        success: function(res) {
          if (res.confirm) {
             self.orderReceiveFun();
          } else if (res.cancel) {}
        }
      })
  },
   orderReceiveFun : function() {
    var order_id = this.order_id;
    var token = this.token;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=receivedOrder&token=" + token + "&order_id=" +　order_id;   
    var self = this;
    var data = {
    };
    
    this.loadding();
    util.ajax({
        "url" :  url,
        "method" :　"POST",
        "data" : data,
        "success" : function(data) {
            if(data['result'] == "ok") {
              self.loaded();
              self.refresh();
            } else {
              self.error(data);
            }  
        }
      });
  }
})
