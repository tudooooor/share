var util = require('../../utils/util.js')
Page({
  data:{
      hadEva:1, //处理后台传来的参数，待评价为1，其他情况则视为已评价
      check_id: 0,
      URL : 3,
      is_over : false,
      no_order : false,
      modalHidden : true,
      expressOpen : 0,
      modalHidden1 : true,
      express : {
        error : false,
        info : '',
        load : true
      },
      orders : false,
      statusAll:[],
      status1:[],
      status2:[],
      status3:[],
      status4:[],
    // text:"这是一个页面"
  },
  deleteOrder: function (event) {
    var that = this;
    console.log(event);
    if (event.currentTarget.dataset.order_id == "") {
      return;
    }
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=orderDel&id=" + event.currentTarget.dataset.order_id + "&token=" + this.token;;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          util.ajax({
            url: url,
            method: "GET",
            success: function (data) {
              that.refresh();
            }
          });
        }
      }
    })
  },
  onLoad:function(options) {
    this.baseApiUrl = util.config('baseApiUrl');
    this.token = wx.getStorageSync('token');
    this.is_onload = 1;
    
    this.options = options;

   
    this.getConfig();


    // 页面初始化 options为页面跳转所带来的参数
    if( wx.getStorageSync('order_type') != '') {
       if(wx.getStorageSync('order_type') == '3') {
          this.setData({"all_status" : 3});
          this.order_status = undefined;  
       } else {
          var all_status = wx.getStorageSync('order_type') == "0" ? 0 : 1;
          this.setData({"all_status" : all_status});
          this.order_status = all_status; 
       }
       
       wx.removeStorageSync('order_type');      
    } 


    var self = this;
      util.checkNet({
        success : function() {
        util.succNetCon(self);
      
        var orders = self.getData();//token,this.offset,this.size
      },
      error : function() {
        util.notNetCon(self);
      }
    });
     
    util.checkNet({
      success : function() {
        util.succNetCon(self);
        util.loadding(self,1);
        self.setData({
          'orders' : [],
          'is_over' : 0,
          'no_order' : 0,
          'pullUpLoad' : 0
        });

        // self.order_status = e.currentTarget.dataset.all_status == '3' ? undefined : e.currentTarget.dataset.all_status;
        self.page = 1;
        self.getData();      
      },
      error : function() {
        util.notNetCon(self,0);
      }
    });

    
  },
  //配置方法
  getConfig:function() {
     var token = wx.getStorageSync('token');
     this.baseApiUrl = util.config('baseApiUrl'); 
     this.size = util.config('page_size');
     this.offset = util.config('page_offset');
     this.token = token;
     this.page = 1;

     this.setData({'pullload_text' : util.config('pullload_text')});
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow: function( e ) {
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    console.log({e});
    if(!this.is_onload) {
      // 页面初始化 options为页面跳转所带来的参数
      if( wx.getStorageSync('order_type') != '') {
         if(wx.getStorageSync('order_type') == '3') {
            this.setData({"all_status" : 3});
            //this.order_status = undefined;  
            console.log({all_status});
         } else {
            var all_status = wx.getStorageSync('order_type') == "0" ? 0 : 1;
            console.log({all_status});
            this.setData({"all_status" : all_status});
            this.order_status = all_status; 
         }
         
         wx.removeStorageSync('order_type');      
         this.refresh(1);
      } else {
        this.refresh();  
      }
    } else {
      this.is_onload = 0;
    }
    
  },
  pullDown: function( e ) {
    if (this.data.is_over == 1) return false;
    this.setData({"pullDown" : 1});
    if(!this.data.is_over) {
      this.page = this.page + 1;
      this.getData();  
    }
  },
  pullUpLoad: function(e) {
  },
  getData:function(isclear=0) {
    if(this.data.no_order == 1) return false;


    var offset = (this.page - 1) * this.size;
    var order_status = this.order_status;
    var size = this.size;
    var token = this.token;

    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=getSellerOrder";    
    var data = {
      "offset" : offset,
      "size" : size,
      "token" : token
    };
    if(order_status != undefined) {
      data.order_status = order_status;
    }
    var self = this;
     util.ajax({
        url : url,
        data : data,
        method : "GET",
        success : function(data){
            self.loaded();
            if(data.result == 'ok') {
              
              var order_list = data.order_list; 
              console.log({order_list});
              var length = order_list.length;
              console.log({length});
              var order_status = util.config('order_status');
              var orders_temp =  order_list.map(function (order) {
                    order.pay_time = util.formatTime(new Date(order.pay_time * 1000));
                    order.order_time = util.formatTime(new Date(order.order_time * 1000));
                    order.order_status_lang = order_status[order.order_status];
                    return order;
                });
              var orders = [];
              self.data.statusAll = [];
              self.data.status1 = [];
              self.data.status2 = [];
              self.data.status4 = [];
              for(var i =0,j =0;i<orders_temp.length;i++)
              {
                if (orders_temp[i].order_status != '3')
                {
                  self.data.statusAll.push(orders_temp[i]);
                }

               if (orders_temp[i].order_status == '1')
                {
                  self.data.status1.push(orders_temp[i]);
                }

                if (orders_temp[i].order_status == '2')
                {
                  self.data.status2.push(orders_temp[i]);
                }

                if (orders_temp[i].order_status == '4')
                {
                  self.data.status3.push(orders_temp[i]);
                }
              }

              var orders = [];
              if (self.data.check_id == 0)
              {
                orders = self.data.statusAll;
              }
              else if (self.data.check_id == 1)
              {
                orders = self.data.status1;
              }
              else if (self.data.check_id == 2)
              {
                orders = self.data.status2;
              }
              else
              {
                orders = self.data.status4;
              }

              self.setData({
                // statusAll:self.data.statusAll,
                // status1:self.data.status1,
                // status2:self.data.status2,
                // status4:self.data.status4,
                orders:orders
              });              
            } else {
               self.error(data);
               return false;
            }
        }
     });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  statusChange:function(e){
     var self = this;
     console.log('statusChange');
     console.log({e});
     self.setData({ "all_status": e.currentTarget.dataset.all_status,pullDown: 0});
     var check_id = e.target.dataset.id;

    var orders = [];
    if (check_id == 0)
    {
      orders = self.data.statusAll;
    }
    else if (check_id == 1)
    {
      orders = self.data.status1;
    }
    else if (check_id == 2)
    {
      orders = self.data.status2;
    }
    else
    {
      orders = self.data.status4;
    }

     self.setData({
        check_id:check_id,
        orders:orders
     })
     console.log(check_id);
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
  loadding:function() {
    util.loadding(this);
 },
 loaded : function() {
    util.loaded(this);
 },
 error:function(data) {
    this.loaded();
    //如果是 查询物流信息出错 不显示弹窗
    if(data.error_code == '41001') {
        this.setData({
          'express' : {
          "loading" : false,"error" : 1,"info" : util.config('error_text')[8]}
        });
        return true;
    }
    
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    } 
  },
  modalConfirm:function(e) {
    util.loadding(this,1);
    
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
    
    util.ajax({
        "url" :  url,
        "method" :　"GET",
        "data" : data,
        "success" : function(data) {
            util.loaded(self);
            if(data['result'] == "ok") {
              self.setData({page : {"load" : 1,"operate" : 0}});
              util.toast(self,'订单取消成功');
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
  //初始化数据
  refresh:function(isclear=0) {
    var self = this;
    util.checkNet({
      success : function() {
         util.succNetCon(self);
         

        //是否清空已有数据
        if(isclear) {
          util.loadding(self);
          self.setData({'is_over' : 0,'no_order' : 0,'pullDown' : 0});
          self.page = 1;
          self.setData({'orders' : false});
          self.getData();
        } else {
          //加载数据完毕后，重载新数据
          if(self.page == 1) {
            self.setData({'is_over' : 0,'no_order' : 0,'pullDown' : 0});
            self.getData(1);
          }
        }

        self.order_id = undefined;
         
      },
      error : function() {
        util.notNetCon(self,0);
      }
    });
  },  

  close_express: function () {
     this.setData( {
        'expressOpen' : 0,
        'shipping_info' : {},
        'express' : {"loading" : false}
     });
  }   
  ,
  expressShow : function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    /*
    wx.navigateTo({
      url: './express?id=' +  order_id
    })
    return false;
    */
    this.setData({"expressOpen" : 1,'express' : {loading : true}});
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
              'express': {
                "loading": false, "error": 1, "info": util.config('error_text')[8]
              }
            });    
          }  
         }
       });
  },
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
  },
  orderConfirmDeliverFun: function () {
    var order_id = this.order_id;
    var token = this.token;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=confirmDeliverOrder&token=" + token + "&order_id=" + 　order_id;
    var self = this;
    var data = {
    };

    this.loadding();
    util.ajax({
      "url": url,
      "method": 　"POST",
      "data": data,
      "success": function (data) {
        if (data['result'] == "ok") {
          self.loaded();
          self.refresh();
        } else {
          self.error(data);
        }
      }
    });
  },
  orderConfirmPayFun: function () {
    var order_id = this.order_id;
    var token = this.token;
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=confirmPayOrder&token=" + token + "&order_id=" + 　order_id;
    var self = this;
    var data = {
    };

    this.loadding();
    util.ajax({
      "url": url,
      "method": 　"POST",
      "data": data,
      "success": function (data) {
        if (data['result'] == "ok") {
          self.loaded();
          self.refresh();
        } else {
          self.error(data);
        }
      }
    });
  }
})