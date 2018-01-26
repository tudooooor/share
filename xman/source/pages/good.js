var util = require('../utils/util.js')

Page({
  data:{
    "domains" : [
        {
          'region_id' : 0,
          "region_name" : '请选择界'
        }
     ],     
    "kingdoms" : [{
      'region_id' : 0,
      "region_name" : '请选择门'
    }],
    "phylums" : [{
        'region_id' : 0,
        "region_name" : '请选择纲目'
    }],
     "regions" : false,
     "good_select" : 0,
     "domainValue" : '',
     "kingdomValue" : '',
     "phylumValue" : '',
     "domainIndex" : '',
     "kingdomIndex" : '',
     "phylumIndex" : '',
     "adTypes" : ['水果','海鲜','零食'],
     "good_name" : ['fruit','seafood','snack'],
     "adTypeIndex" : 0,
     "domainsAnimation" : {},
     "kingdomsAnimation" : {},
     "phylumsAnimation" : {},
     'domainTop' : "0em",
     'kingdomTop' : "0em",
     'phylumTop'  : "0em",
     'domainVal' : "0",
     'kingdomVal' : "0",
     'phylumVal'  : "0",
     'modalHidden' : true,
     'good' :  {
       "receive_name" : '',
       "repertory" : '',
       "price" : '',
       "good" : ''
     },
     'receive_name_tip' : false,
     'price_tip' : false,
	   'repertory_tip' : false,
     'domain_tip' : false,
     'pyhlum_tip' : false,
     'kingdom_tip' : false,
     'adType_tip' : false,
     'adinfo_tip' : false
  },
  formId:function(options){
  },
  deletes:function(options){
    var self = this;
    wx.showModal({
      title: '确定删除这个商品吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
           self.modalConfirm();
        } 
      }
    })
    //this.setData({modalHidden : false});
  },
  modalConfirm:function(options){
    util.loadding(this,1);
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=good&good_id=" + this.options.good_id + "&token=" + this.token;;
    var self = this;
     util.ajax({
        url : url,
        method : "DELETE",
        success : function(data){
            if(data.result == 'ok') {
               util.loadding(self);
               var url = "./goodadv";
               if(self.options.goods_id != undefined) {
                   url = url + "?sell_type=" + self.options.sell_type + "&goods_id=" 
                        + self.options.goods_id + "&good_id=" + self.options.good_id;
               }
               
               wx.navigateBack();
               // wx.redirectTo({
               //    url: url
               // })
            } else {
                self.error(data);
            }
        }
     });
    this.setData({modalHidden : true});
  },
  //错误处理函数
  error:function(data) {
    this.setData({page : {load : 1}});
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    }
  },
  modalCancel:function(options){
    this.setData({modalHidden : true});
  },
  receive_function:function(e){
   // if(!e.detail.value.trim()) {
      // this.setData({'receive_name_tip' : true});
  //  } else {
   //    this.setData({'receive_name_tip' : false});
   // }
  },
  repertory_function:function(e){
    //if (!e.detail.value.trim()) {
        // this.setData({'repertory_tip' : true});
        // console.log(this.data);
      //} else {
       //  this.setData({'repertory_tip' : false});
   //  }
  },
  price_function:function(e){
    //if(!e.detail.value.trim()) {
       // this.setData({'price_tip' : true});
    //  } else {
       // this.setData({'price_tip' : false});
     // }

     // if(!/^\d{0,}$/.test(e.detail.value.trim())) {

     //   this.setData({'price_tip' : true});
    //  } else {
        //this.setData({'price_tip' : false});
     // }
  },
  adinfo_function:function(e){
   // if(!e.detail.value.trim()) {
    //   this.setData({'adinfo_tip' : true});
   // } else {
  //    this.setData({'adinfo_tip' : false});
    // }
  },
  //添加地址 || 或者修改地址
  listenFormSubmit:function(e){

    var that = this;  
    var formData = e.detail.value;   
/*
    if(!formData.receive_name.trim()) {
       this.setData({'receive_name_tip' : true});
    } else {
       this.setData({'receive_name_tip' : false});
    }

     if(!formData.repertory.trim()) {
  
       this.setData({'repertory_tip' : true});
    } else {
       this.setData({'repertory_tip' : false});
    }
    
    if(!formData.price.trim()) {
  
       this.setData({'price_tip' : true});
    } else {
       this.setData({'price_tip' : false});
    }

    if(!/^\d{0,}$/.test(formData.price.trim())) {

       this.setData({'price_tip' : true});
    } else {
      this.setData({'price_tip' : false});
    }

    if(!formData.good_name.trim()) {
  
       this.setData({'adType_tip' : true});
    } else {
      this.setData({'adType_tip' : false});
    }

    if(!formData.domain.trim()) {
       this.setData({'domain_tip' : true});
    } else {
      this.setData({'domain_tip' : false});
    }

     if(!formData.kingdom.trim() && !this.data.domain_tip) {
       this.setData({'kingdom_tip' : true});
    } else {
       this.setData({'kingdom_tip' : false});
    }
    
    if(!formData.phylum.trim() && !this.data.kingdom_tip && !this.data.domain_tip) {
    
       this.setData({'phylum_tip' : true});
    } else {
       this.setData({'phylum_tip' : false});
    }

    
    if(!formData.good.trim()) {
       this.setData({'adinfo_tip' : true});
    } else {
       this.setData({'adinfo_tip' : false});
    }

    if(this.data.receive_name_tip || this.data.price_tip || this.data.domain_tip || this.data.kingdom_tip ||this.data.phylum_tip ||this.data.adType_tip ||this.data.adinfo_tip) {
      return false;
    }
*/
    util.loadding(this,1);
    if(!this.options.good_id) {
      this.addgood(formData);
    } else {
       this.editgood(formData);
    }
  },
   bindHideKeyboard: function(e) {
      wx.hideKeyboard()
  },
  addgood:function(formData) {
    var url = this.baseApiUrl + "?g=Api&m=Weuser&a=good&token=" + this.token;
     var self = this;
     util.ajax({
        url : url,
        data : formData,
        method : "POST",
        success : function(data){
            util.loaded(self);
            if(data.result == 'ok') {
               if(self.options.goods_id != undefined && self.options.sell_type != undefined) {
                  wx.setStorageSync('select_good_id',data.good_id);

                  var pages = getCurrentPages()    //获取加载的页面
                  if(pages[pages.length-2] != undefined && pages[pages.length-2].route == "pages/goodadv") {
                    wx.navigateBack({delta : 2});
                    return; 
                  }

                  wx.navigateBack({delta : 1});
                  return ;
               }
               
               wx.navigateBack(); 
            } 
        }
     });
  },
  editgood:function(formData){
     var url = this.baseApiUrl + "?g=Api&m=Weuser&a=good&good_id=" + this.options.good_id + "&token=" + this.token;
     var self = this;
     util.ajax({
        url : url,
        data : formData,
        method : "PUT",
        success : function(data){
            util.loaded(self);
            if(data.result == 'ok') {
               var url = "./goodadv";
               if(self.options.goods_id != undefined && self.options.goods_id != "undefined" &&  self.options.sell_type != undefined &&  self.options.sell_type != "undefined") {
                  wx.setStorageSync('select_good_id',self.options.good_id);
                  wx.navigateBack({delta : 2});
                  return;
               }

               wx.navigateBack();
            }
        }
     });
  },
  onLoad:function(options){
    if(this.options.good_id) {
      wx.setNavigationBarTitle({
        title: '商品编辑'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '我要来上新'
      })
    }

    util.loadding(this);

    console.log("op : " + JSON.stringify(options));
    this.options = options;
    var self = this;
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl'); 
    
    var data_version = wx.getStorageSync('data_version');
    
    var url = this.baseApiUrl + "?g=api&m=project&a=data_version&type=region_list"; 

    var regions = [];
    util.ajax({
      "url" :  url,
      "data" : {},
      success : function(data) {
        if(data.result == 'ok') {
            
            if(data.data_version.version != data_version) {
              self.regions();  
              wx.setStorageSync('data_version',data.data_version.version);
              regions = this.regions_data;
            } else {
               regions = wx.getStorageSync('regions');
               if(regions) {
                 self.setData({
                   //regions :　regions,
                   domains : regions[1]
                 });
                 self.regions_data = regions;
                 self.editHtml(regions);
              } else {
                  self.regions();  
                  regions = this.regions_data;
              }
            }

            
            //util.loaded(self);
          //  self.setData({loaded:false});
            // while(true) {
            //   if(regions) {
            //       break;
            //   }
            // }
          
        }
      },
      error : function(res) {
        //console.log("网络错误");
      }
    });
    
    //console.log(regions);
   
    
    //console.log(regions);
    // 页面初始化 options为页面跳转所带来的参数
     //this.init();
  },
  editHtml:function(regions){
    var self = this;
    if(this.options.good_id) {
       util.loadding(this,1);
       var url = this.baseApiUrl + "?g=Api&m=Weuser&a=good&good_id=" + this.options.good_id + "&token=" + this.token;
       util.ajax({
          "url" :  url,
          "data" : {},
          success : function(data) {
             util.loaded(self);
             if(data.result == 'ok') {
                self.setData({loaded:true});
                var adTypeIndex = -1;
                var good_names = self.data.good_name;
                //console.log(good_names);
                for(var i=0;i<good_names.length;i++) {
                  if(good_names[i] == data.good.good_name) {
                    adTypeIndex = i;
                    break;
                  }
                }

                
                var domainId = data.good.domain_id;
                var domains = regions[1];
                var domainVal = 0;

                var kingdomId = data.good.kingdom_id;
                //var kingdoms = regions[2];
                var kingdomVal = 0;

                var areaVal = 0;
                
                var areaId = data.good.phylum_id;
                
                //start重置省份
                var domain = regions[1];

                  //console.log('value ： ' + val);
                  //id = data.good.domain_id;

                  var kingdoms = [];
                  var kingdom = regions[2];
                  for(var ii = 0;ii < kingdom.length;ii++) {
                      if(domainId == kingdom[ii].parent_id) {
                        kingdoms.push(kingdom[ii]);
                      }
                  }


                  var areas = [];

                  var area = regions[3];
                  for(var iii = 0;iii < area.length;iii++) {
                    if(kingdomId == area[iii].parent_id) {
                      areas.push(area[iii]);
                    }
                  }

                  //console.log('areas===');
                  //console.log(areas);
                  
                  // _that.setData({
                  //     domains : domain,
                  //     kingdoms : kingdoms,
                  //     areas : areas,
                  //     areaIndex : areas[0].region_id
                  // });
                  //end

               
                //var areas = regions[3];
                

                
               
                for(var ii = 0;ii < kingdoms.length;ii++) {
                    if(kingdomId == kingdoms[ii].region_id) {
                      kingdomVal = ii;
                      var kingdomValue = kingdoms[ii].region_name;
                      break;
                    }
                }

               for(var iiii = 0 ; iiii < areas.length; iiii++) {
                  if(areaId == areas[iiii].region_id) {
                    areaVal = iiii;
                    var areaValue = areas[iiii].region_name;
                    break;
                  }
               }
              
                for(var ii = 0;ii < domains.length;ii++) {
                    if(domainId == domains[ii].region_id) {
                        domainVal = ii;
                        var domainValue = domains[ii].region_name;
                        break;
                    }
                }

                self.setData({
                  kingdoms : kingdoms,
                  areas : areas,
                  "good" : data.good,
                  "adTypeIndex" : adTypeIndex,
                  'domainVal' : domainVal,
                  'kingdomVal' : kingdomVal,
                  'areaVal'  : areaVal,
                  "domainIndex" : domainId,
                  "kingdomIndex" : kingdomId,
                  "areaIndex" : areaId,
                  "domainValue" : domainValue,
                  "kingdomValue" : kingdomValue,
                  "areaValue" : areaValue,
                });

                self.init();
                self.setData({
                  "domainTop" : -2.5 * domainVal + "em",
                  'kingdomTop' : -2.5 * kingdomVal  + "em",
                  'areaTop'  : -2.5 * areaVal  + "em"
                });
             }
          },
          error : function(res) {
            //console.log("网络错误");
          }
        });
    } else {
      //根据系统定位,获取默认地址
      var userMap = wx.getStorageSync("userMap");
      if(userMap != undefined && userMap) {
        var url = this.baseApiUrl + "?g=Api&m=Weuser&a=regions&token=" + this.token;
        util.ajax({
        url : url,
        data : userMap,
        method : "POST",
        success : function(data){
            if(data.result == 'ok') {
              self.byRegionsId(regions,data.region.domain_id,data.region.kingdom_id,data.region.phylum_id);  
            }
        }})};
      this.setData({loaded:true});
    }


  },
  //添加地址根据地区id定位城市
  byRegionsId: function(regions,domainId,kingdomId,areaId) {
    var self = this;
    //var domainId = data.good.domain_id;
    var domains = regions[1];
    var domainVal = 0;

    //var kingdomId = data.good.kingdom_id;
    //var kingdoms = regions[2];
    var kingdomVal = 0;

    var areaVal = 0;
    
    //var areaId = data.good.phylum_id;
    
    //start重置省份
    var domain = regions[1];

      //console.log('value ： ' + val);
      //id = data.good.domain_id;

      var kingdoms = [];
      var kingdom = regions[2];
      for(var ii = 0;ii < kingdom.length;ii++) {
          if(domainId == kingdom[ii].parent_id) {
            kingdoms.push(kingdom[ii]);
          }
      }


      var areas = [];

      var area = regions[3];
      for(var iii = 0;iii < area.length;iii++) {
        if(kingdomId == area[iii].parent_id) {
          areas.push(area[iii]);
        }
      }

    
    for(var ii = 0;ii < kingdoms.length;ii++) {
        if(kingdomId == kingdoms[ii].region_id) {
          kingdomVal = ii;
          var kingdomValue = kingdoms[ii].region_name;
          break;
        }
    }

    for(var iiii = 0 ; iiii < areas.length; iiii++) {
      if(areaId == areas[iiii].region_id) {
        areaVal = iiii;
        var areaValue = areas[iiii].region_name;
        break;
      }
    }
  
    for(var ii = 0;ii < domains.length;ii++) {
        if(domainId == domains[ii].region_id) {
            domainVal = ii;
            var domainValue = domains[ii].region_name;
            break;
        }
    }

    //console.log(areaValue);

    self.setData({
      kingdoms : kingdoms,
      areas : areas,
      'domainVal' : domainVal,
      'kingdomVal' : kingdomVal,
      'areaVal'  : areaVal,
      "domainIndex" : domainId,
      "kingdomIndex" : kingdomId,
      "areaIndex" : areaId,
      "domainValue" : domainValue,
      "kingdomValue" : kingdomValue,
      "areaValue" : areaValue
    });

    self.init();

    self.setData({
      "domainTop" : -2.5 * domainVal + "em",
      'kingdomTop' : -2.5 * kingdomVal  + "em",
      'areaTop'  : -2.5 * areaVal  + "em"
    });
  }
  ,
  init: function() {
    //this.data.kingdomValue;
    //this.data.domainValue;
    //this.data.areaValue;
    //var pos = target["pos_" + target.id];
    //var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
    var domainTop = parseFloat(this.data.domainTop.replace(/em/g, ""));
    var kingdomTop = parseFloat(this.data.kingdomTop.replace(/em/g, ""));
    var areaTop = parseFloat(this.data.areaTop.replace(/em/g, ""));

    //坐标
    var domainPos = domainTop;
    var kingdomPos = kingdomTop;
    var areaPos = areaTop;

    for(var i = 0;i < parseInt(this.data.domainVal); i++) {
        domainPos = domainPos - 2.5;
    }

    for(var i = 0;i < parseInt(this.data.kingdomVal); i++) {
        kingdomPos = kingdomPos - 2.5;
    }

    for(var i = 0;i < parseInt(this.data.areaVal); i++) {
        areaPos = areaPos - 2.5;
    }

    this.animationObj1.translate3d(0,domainPos + "em",0).step({duration: 80});
    this.setData({
      animationdomains : this.animationObj1.export(),
    }); 

    this.animationObj2.translate3d(0,kingdomPos + "em",0).step({duration: 80});
    this.setData({
      animationkingdoms : this.animationObj2.export(),
    });

    this.animationObj3.translate3d(0,areaPos + "em",0).step({duration: 80});
    this.setData({
        animationAreas : this.animationObj3.export(),
     })

    //console.log(this.data); 
  },
  regions: function(e) {
    util.loadding(this);
    var self = this;
    var url = this.baseApiUrl + "?g=api&m=project&a=regions";
    util.ajax({
      "url" :  url,
      "data" : {},
      success : function(data) {
        if(data.result == 'ok') {
            util.loaded(self);
            var regions = data.regions;
            if(regions) {
              self.setData({
                //regions :　regions,
                domains : regions[1]
              });
              self.regions_data = regions;
              self.editHtml(regions);
            }
            wx.setStorageSync('regions',regions);
        }
      },
      error : function(res) {
        //console.log("网络错误");
      }
    });
  },
  bindPickerChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  tapName:function(e){
    //console.log(e);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
	this.setData({page : {"load" : 1}});
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })

    this.animationObj1 = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease',
    })
    
    this.animationObj2 = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease',
    })
    this.animationObj3 = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease',
    })
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  good_select: function(e) {
    //console.log(this.regions_data[1]);
     this.setData({
      good_select: 1
    })
  },
  domains : function(e){
    var id = e.currentTarget.dataset.id;
    var kingdoms = [];

     var kingdom = this.regions_data[2];
     for(var ii = 0;ii < kingdom.length;ii++) {
        if(id == kingdom[ii][2]) {
          kingdoms.push(kingdom[ii]);
        }
     }
     this.setData({
        'kingdoms' : kingdoms
     });
    //console.log(kingdoms);
  },
  kingdoms : function(e){
    var id = e.currentTarget.dataset.id;
    var areas = [];

    var area = this.regions_data[3];
    for(var iii = 0;iii < area.length;iii++) {
      if(id == area[iii][2]) {
        areas.push(area[iii]);
      }
    }
    this.setData({
        'areas' : areas
     });
    //console.log(areas);
  },
  areas : function(e){
     var id = e.currentTarget.dataset.id;
     this.setData({
        "areaIndex" : id
     });
  },
  
  adTypesChange: function(e) {
    var adTypeIndex = e.detail.value; 
    if(adTypeIndex == this.data.adTypeIndex || adTypeIndex == "null") {
      return false;
    }
    this.setData({
      adTypeIndex: adTypeIndex
    })
  },

  finish: function(e) {
     var id = this.data.areaIndex;
     var kingdom = this.data.kingdoms;
     var kingdomName = '';
     var kingdomPid = '';



    var domain = this.data.domains;
    var domainName = '';
    var domainId = '';

    var area = this.data.areas;
    var areaPid = '';
    var areaName = '';


    for(var iiii = 0 ; iiii < area.length; iiii++) {
      if(id == area[iiii].region_id) {
        areaPid = area[iiii].parent_id;
        areaName = area[iiii].region_name;
        break;
      }
    }

     for(var ii = 0;ii < kingdom.length;ii++) {
        if(areaPid == kingdom[ii].region_id) {
          kingdomName = kingdom[ii].region_name;
          kingdomPid = kingdom[ii].parent_id;
          break;
        }
     }

     if(kingdomPid) {
       for(var ii = 0;ii < domain.length;ii++) {
          if(kingdomPid == domain[ii].region_id) {
            domainName = domain[ii].region_name;
            break;
          }
       }
     }
    
    if(!domainName.trim()) {
       this.setData({'domain_tip' : true});
    } else {
      this.setData({'domain_tip' : false});
    }

     if(!kingdomName.trim()) {
       this.setData({'kingdom_tip' : true});
    } else {
       this.setData({'kingdom_tip' : false});
    }
    
    if(!areaName.trim()) {
    
       this.setData({'phylum_tip' : true});
    } else {
       this.setData({'phylum_tip' : false});
    }

    this.setData({
       "domainValue" : domainName,
       "kingdomValue" : kingdomName,
       "areaValue" : areaName,
       "domainIndex" : kingdomPid,
       "kingdomIndex" : areaPid,
       "areaIndex" : id,
       "good_select" : 0
    });
  },
  close: function(e) {
    this.setData({
      "good_select" : 0
    });
  },

  //触摸开始
  touchstart: function(e) {
     console.log('touchstart');

         
     var target = e.currentTarget;
     
     this.childTarget = e.target;

     while (true) {
        if (target.dataset.class == undefined || target.dataset.class != "gear") {
            target = target.target;
        } else {
            break
        }
      } 
      clearInterval(target["int_" + target.id]);
      target["old_" + target.id] = e.touches[0].clientY;
      target["o_t_" + target.id] = (new Date()).getTime();
      var top = target.dataset.top;

      //console.log('top:' + top);
      if(target.dataset.type == 'domains') {
        top = this.data.domainTop;
        this.setData({
            domainTop : top
        });
      } else if(target.dataset.type == 'kingdoms') {
        top = this.data.kingdomTop;
        this.setData({
            kingdomTop : top
        });
      } else if(target.dataset.type == 'areas') {
        top = this.data.areaTop;
        this.setData({
            areaTop : top
        });
      }
      if (top) {
          target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
      } else {
          target["o_d_" + target.id] = 0;
      }

      if(target.dataset.type == 'domains') {
           this.animationObj1.step({duration: 0}); 
            this.setData({
              animationdomains : this.animationObj1.export()
            })
      } else if(target.dataset.type == 'kingdoms') {
        this.animationObj2.step({duration: 0}); 
        this.setData({
          animationkingdoms : this.animationObj2.export()
        })
      } else if(target.dataset.type == 'areas') {
         this.animationObj3.step({duration: 0}); 
          this.setData({
            animationAreas : this.animationObj3.export()
          })
      }   

      this.target = target;
      
  },
  //触摸移动
  touchmove: function(e) {
    
     //console.log('touchmove');

     var target = this.target;
     while (true) {
        if (target.dataset.class == undefined || target.dataset.class != "gear") {
            target = target.target;
        } else {
            break
        }
      } 

      target["new_" + target.id] = e.touches[0].clientY;
      target["n_t_" + target.id] = (new Date()).getTime();

      var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / this.data.windowHeight;


      //console.log(f);

      target["pos_" + target.id] = target["o_d_" + target.id] + f;


      //console.log("y_" +　target["new_" + target.id]);
      //console.log("old" +　target["old_" + target.id]);
      //console.log("clientY" +　e.touches[0].clientY);
      //console.log("pos:" + target["pos_" + target.id]);

      if(target.dataset.type == 'domains') {
          this.animationObj1.translate3d(0,target["pos_" + target.id] + "em",0).step(); 
          this.setData({
            animationdomains : this.animationObj1.export()
          })
      } else if(target.dataset.type == 'kingdoms') {
        this.animationObj2.translate3d(0,target["pos_" + target.id] + "em",0).step(); 
        this.setData({
          animationkingdoms : this.animationObj2.export()
        })
      } else if(target.dataset.type == 'areas') {
        this.animationObj3.translate3d(0,target["pos_" + target.id] + "em",0).step(); 
        this.setData({
          animationAreas : this.animationObj3.export()
        })
      }   


      if(e.touches[0].clientY < 1){
          this.gearTouchEnd(e);
      };   

      this.target = target;

  },

  //触摸结束
  touchend: function(e) {
     var target = this.target;
     while (true) {
        if (target.dataset.class == undefined || target.dataset.class != "gear") {
            target = target.target;
        } else {
            break
        }
      } 

      var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
      if (Math.abs(flag) <= 0.2) {
          target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
      } else {
          if (Math.abs(flag) <= 0.5) {
              target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
          } else {
              target["spd_" + target.id] = flag / 2;
          }
      }
      if (!target["pos_" + target.id]) {
          target["pos_" + target.id] = 0;
      }
      
      this.rollGear(target);
      
      this.target = target;

  },
  rollGear : function(target) {
     var _that = this;
     //console.log(target);
     //控制插件滚动后停留的值
     function setGear (target, val) {
        //console.log("val:" + val);

        val = Math.round(val);

        if(isNaN(val)) {
          val = 0;
        }

        target.dataset.val = val;

        //console.log(target);
        var id = false;
      
        
        switch(target.dataset.type){
              case "domains":
                  var domain = _that.regions_data[1];

                  //console.log('value ： ' + val);
                  id = domain[val].region_id;

                  var kingdoms = [];
                  var kingdom = _that.regions_data[2];
                  for(var ii = 0;ii < kingdom.length;ii++) {
                      if(id == kingdom[ii].parent_id) {
                        kingdoms.push(kingdom[ii]);
                      }
                  }
                  
                  var kingdomVal = _that.data.kingdomVal;
                  if(kingdoms.length - 1 < kingdomVal) {
                      kingdomVal = kingdoms.length - 1;
                  } 
                  _that.animationObj2.translate3d(0,kingdomVal * -2.5 + "em",0).step({duration: 200});
                  _that.setData({
                      animationkingdoms : _that.animationObj2.export(),
                  })
                  
                  var areas = [];

                  var area = _that.regions_data[3];
                  for(var iii = 0;iii < area.length;iii++) {
                    if(kingdoms[kingdomVal].region_id == area[iii].parent_id) {
                      areas.push(area[iii]);
                    }
                  }

                  //console.log('areas===');
                 // console.log(areas);
                  var areaVal = _that.data.areaVal;
                  if(areas.length - 1 < areaVal) {
                      areaVal = areas.length - 1;
                  } 
                  _that.animationObj3.translate3d(0,areaVal * -2.5 + "em",0).step({duration: 200});
                  _that.setData({
                    animationAreas : _that.animationObj3.export(),
                  })

                  _that.setData({
                      domains : domain,
                      kingdoms : kingdoms,
                      areas : areas,
                      areaIndex : areas[areaVal].region_id
                  });

                  // _that.animationObj2.translate3d(0,0 + "em",0).step({duration: 200});
                  // _that.setData({
                  //     animationkingdoms : _that.animationObj2.export(),
                  // })

                  // _that.animationObj3.translate3d(0,0 + "em",0).step({duration: 200});
                  // _that.setData({
                  //     animationAreas : _that.animationObj3.export(),
                  // })
                
                  break;
              case 'kingdoms':
                var kingdom = _that.data.kingdoms;
                id = kingdom[val].region_id;

                var areas = [];

                var area = _that.regions_data[3];
                for(var iii = 0;iii < area.length;iii++) {
                  if(id == area[iii].parent_id) {
                    areas.push(area[iii]);
                  }
                }

                var areaVal = _that.data.areaVal;
                if(areas.length - 1 < areaVal) {
                    areaVal = areas.length - 1;
                } else {
                   _that.setData({
                      kingdomVal : val
                  })   
                }
                _that.animationObj3.translate3d(0,areaVal * -2.5 + "em",0).step({duration: 200});
                _that.setData({
                  animationAreas : _that.animationObj3.export(),
                })

                 _that.setData({
                    kingdoms : kingdom,
                    areas : areas,
                    areaIndex : areas[areaVal].region_id
                  });
                  
                break;
                
                case 'areas':
                  var area = _that.data.areas;
                  id = area[val].region_id;

                  _that.setData({
                      areaIndex : id,
                      areaVal : val
                  });
                break;
          }
    }
    var d = 0;
    var stopGear = false;
    function setDuration() {
        stopGear = true;
    }
    clearInterval(target["int_" + target.id]);
    target["int_" + target.id] = setInterval(function() {
        var pos = target["pos_" + target.id];
        var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
        pos += speed;
        if (Math.abs(speed) > 0.1) {} else {
            var b = Math.round(pos / 2.5) * 2.5;
            pos = b;
            setDuration();
        }
        if (pos > 0) {
            pos = 0;
            setDuration();
        }
        var minTop = -(target.dataset.len - 1) * 2.5;
      
        if (pos < minTop) {
            pos = minTop;
            setDuration();
        }
        if (stopGear) {
            var gearVal = Math.abs(pos) / 2.5;
            setGear(target, gearVal);
            clearInterval(target["int_" + target.id]);
        }
        target["pos_" + target.id] = pos;

        
         if(target.dataset.type == 'domains') {
            _that.animationObj1.translate3d(0,pos + "em",0).step({duration: 80});
            _that.setData({
              animationdomains : _that.animationObj1.export(),
            })
        } else if(target.dataset.type == 'kingdoms') {
             _that.animationObj2.translate3d(0,pos + "em",0).step({duration: 80});
             _that.setData({
                animationkingdoms : _that.animationObj2.export(),
            })
        } else if(target.dataset.type == 'areas') {
           _that.animationObj3.translate3d(0,pos + "em",0).step({duration: 80});
           _that.setData({
              animationAreas : _that.animationObj3.export(),
           })
        }   
        
        var top = pos  + 'em';
        if(target.dataset.type == 'domains') {
          
          _that.setData({
              domainTop : top
          });
        } else if(target.dataset.type == 'kingdoms') {
         
          _that.setData({
              kingdomTop : top
          });
        } else if(target.dataset.type == 'areas') {
         
          _that.setData({
              areaTop : top
          });
        }
        d++;
    }, 30);  
  },
})